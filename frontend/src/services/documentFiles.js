const DATABASE_NAME = 'pako-document-files';
const STORE_NAME = 'files';

function openDatabase() {
  if (!('indexedDB' in window)) {
    return Promise.reject(new Error('This browser does not support persistent document storage.'));
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open document storage.'));
    request.onblocked = () => reject(new Error('Document storage is blocked by another browser tab.'));
  });
}

function transactionComplete(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error || new Error('Document storage transaction failed.'));
    transaction.onabort = () => reject(transaction.error || new Error('Document storage transaction was aborted.'));
  });
}

export async function saveDocumentFile(id, file) {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const complete = transactionComplete(transaction);
    transaction.objectStore(STORE_NAME).put(file, String(id));
    await complete;
  } finally {
    database.close();
  }
}

export async function getDocumentFile(id) {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const complete = transactionComplete(transaction);
    const request = transaction.objectStore(STORE_NAME).get(String(id));
    const file = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Could not read the stored document.'));
    });
    await complete;
    return file;
  } finally {
    database.close();
  }
}

export async function deleteDocumentFile(id) {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const complete = transactionComplete(transaction);
    transaction.objectStore(STORE_NAME).delete(String(id));
    await complete;
  } finally {
    database.close();
  }
}
