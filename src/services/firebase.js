import firebase from 'firebase/app';
import rug from 'random-username-generator';

function checkUsernameRegex(username) {
  const regex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
  return regex.test(username);
}

async function logout() {
  try {
    await firebase.auth().signOut();
  } catch {
    console.warn('An error ocurred while signing out user');
  }
}

async function deleteAccount(user) {
  if (!user) {
    console.warn('User for deletion not provided');
    return;
  }

  try {
    await user.delete();
    // TODO: Delete from Firestore
  } catch {
    console.warn('An error ocurred while deleting user');
  }
}

async function checkUserForLogin(user) {
  const db = firebase.firestore();

  const query = await db.collection('users')
    .where('email', '==', user.email)
    .get();

  // User exists in database and is verified
  if (!query.empty && user.emailVerified) {
    const updatedUser = { ...user };
    query.forEach((doc) => {
      const data = doc.data();
      updatedUser.username = data.username;
    });
    return [true, updatedUser];
  }

  // If user haven't verified its email
  if (!query.empty && !user.emailVerified) {
    await logout();
    return [false, 'Debes verificar tu correo para acceder a tu cuenta'];
  }

  // Else, user not in database, so we should sign out from Firebase,
  // delete user and return an error
  await logout();
  await deleteAccount(user);
  return [false, 'Para ingresar, primero debes crear una cuenta'];
}

async function fillUserAttributes(user) {
  const db = firebase.firestore();
  const userToFill = { ...user };
  const userDoc = await db.collection('users').doc(user.uid).get();

  if (user && userDoc.exists) {
    const firestoreUser = userDoc.data();
    userToFill.fullName = firestoreUser.fullName;
    userToFill.username = firestoreUser.username;
    return userToFill;
  }

  return null;
}

async function getCurrentUser() {
  const user = firebase.auth().currentUser;
  return fillUserAttributes(user);
}

async function loginWithEmail(email, password) {
  try {
    const user = await firebase.auth().signInWithEmailAndPassword(email, password);
    return await checkUserForLogin(user);
  } catch (error) {
    let message = 'Un error ha ocurrido al iniciar sesión, intenta más tarde';
    if (error.code === 'auth/user-not-found') {
      message = 'Para ingresar, primero debes crear una cuenta';
    }
    return [false, message];
  }
}

async function loginWithFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();

  try {
    const result = await firebase.auth()
      .signInWithPopup(provider);
    const { user } = result;
    return await checkUserForLogin(user);
  } catch {
    return [false, 'Un error ha ocurrido al iniciar sesión con Facebook, intenta más tarde'];
  }
}

async function signUpWithEmail(email, password, fullName, username) {
  const usernameIsValid = checkUsernameRegex(username);

  if (!usernameIsValid) {
    return [false, 'El formato del nombre de usuario es inválido'];
  }

  const db = firebase.firestore();
  let user;
  try {
    const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
    user = result.user;
    await user.updateProfile({
      displayName: fullName,
    });
  } catch (error) {
    let message = 'Un error ha ocurrido al crear tu cuenta, intenta más tarde';
    if (error.code === 'auth/email-already-in-use') {
      message = 'La dirección de correo especificada ya está en uso';
    }
    return [false, message];
  }

  try {
    const existingUser = await db.collection('users').doc(user.uid).get();
    if (existingUser.exists) {
      await deleteAccount(user);
      return [false, 'Esta cuenta ya está registrada'];
    }
    const existingUsername = await db.collection('users')
      .where('username', '==', username)
      .get();
    if (!existingUsername.empty) {
      await deleteAccount(user);
      return [false, 'El nombre de usuario especificado ya está en uso'];
    }

    await db.collection('users').doc(user.uid).set({ username, email, fullName });
  } catch {
    // We couldn't register user in database, so we delete that account so we they can try again
    await deleteAccount(user);
    return [false, 'Ha ocurrido un error al registrar al usuario, intenta más tarde'];
  }

  await user.sendEmailVerification();
  return [true, user];
}

async function signUpWithFacebook() {
  const db = firebase.firestore();
  const provider = new firebase.auth.FacebookAuthProvider();
  let user;

  try {
    const result = await firebase.auth()
      .signInWithPopup(provider);
    user = result.user;
  } catch {
    const message = 'Un error ha ocurrido al crear tu cuenta con Facebook, intenta más tarde';
    return [false, message];
  }

  try {
    const existingUser = await db.collection('users').doc(user.uid).get();
    if (existingUser.exists) {
      await deleteAccount(user);
      return [false, 'Esta cuenta ya está registrada'];
    }

    let username;
    let usernameIsNotAvailable = true;
    while (usernameIsNotAvailable) {
      username = rug.generate();
      // eslint-disable-next-line no-await-in-loop
      const existingUsername = await db.collection('users')
        .where('username', '==', username)
        .get();
      if (existingUsername.empty) {
        usernameIsNotAvailable = false;
      }
    }

    await db.collection('users').doc(user.uid).set({
      username,
      email: user.email,
      fullName: user.displayName,
    });
  } catch {
    // We couldn't register user in database, so we delete that account so we they can try again
    await deleteAccount(user);
    return [false, 'Ha ocurrido un error al registrar al usuario con Facebook, intenta más tarde'];
  }

  await user.sendEmailVerification();
  await firebase.auth().signOut(); // This is because we first want to verify accounts
  return [true, user];
}

export default {
  getCurrentUser,
  fillUserAttributes,
  loginWithEmail,
  loginWithFacebook,
  signUpWithEmail,
  signUpWithFacebook,
  logout,
};
