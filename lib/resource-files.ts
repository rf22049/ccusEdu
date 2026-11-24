export type ResourceFile = {
  slug: string;
  name: string;
  type: string;
  size: number;
  blob: Blob;
  updatedAt: number;
};

const DATABASE_NAME = "ccus-resource-files";
const STORE_NAME = "files";
const DATABASE_VERSION = 1;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: "slug" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Database berkas tidak dapat dibuka."));
    request.onblocked = () => reject(new Error("Database berkas sedang digunakan di tab lain."));
  });
}

export async function saveResourceFile(slug: string, file: File) {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put({
        slug,
        name: file.name,
        type: file.type,
        size: file.size,
        blob: file,
        updatedAt: Date.now(),
      } satisfies ResourceFile);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Berkas tidak dapat disimpan."));
      transaction.onabort = () => reject(transaction.error ?? new Error("Penyimpanan berkas dibatalkan."));
    });
  } finally {
    database.close();
  }
}

export async function getResourceFile(slug: string): Promise<ResourceFile | undefined> {
  const database = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(slug);
      request.onsuccess = () => resolve(request.result as ResourceFile | undefined);
      request.onerror = () => reject(request.error ?? new Error("Berkas tidak dapat dibaca."));
    });
  } finally {
    database.close();
  }
}

export async function deleteResourceFile(slug: string) {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).delete(slug);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Berkas tidak dapat dihapus."));
      transaction.onabort = () => reject(transaction.error ?? new Error("Penghapusan berkas dibatalkan."));
    });
  } finally {
    database.close();
  }
}
