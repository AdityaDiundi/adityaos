import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, runTransaction, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDMZx3TAIuSzt1ryow7dy4Oq4CKTiux7vo",
  authDomain: "pixel-engine-stats.firebaseapp.com",
  databaseURL: "https://pixel-engine-stats-default-rtdb.firebaseio.com",
  projectId: "pixel-engine-stats",
  storageBucket: "pixel-engine-stats.firebasestorage.app",
  messagingSenderId: "641539087267",
  appId: "1:641539087267:web:b5c568785e8bd659661816",
  measurementId: "G-SSYN3T4NLY",
};

let db: Database | null = null;

export function getFirebaseDatabase(): Database | null {
  if (typeof window === "undefined") return null;
  try {
    if (!db) {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      db = getDatabase(app);
    }
    return db;
  } catch (err) {
    console.warn("Firebase initialization skipped:", err);
    return null;
  }
}

export interface GlobalCommunityStats {
  totalPixelsDrawn: number;
  totalPixelsPopped: number;
  totalNotesPlayed: number;
}

// Queue to batch increments every few seconds
const pendingIncrements = {
  drawn: 0,
  popped: 0,
};

let batchIntervalStarted = false;

function ensureBatchProcessor() {
  if (batchIntervalStarted || typeof window === "undefined") return;
  batchIntervalStarted = true;

  setInterval(() => {
    const { drawn, popped } = pendingIncrements;
    if (drawn <= 0 && popped <= 0) return;

    // Reset local queue
    pendingIncrements.drawn = 0;
    pendingIncrements.popped = 0;

    const database = getFirebaseDatabase();
    if (!database) return;

    const drawnInc = Math.min(drawn, 1000);
    const poppedInc = Math.min(popped, 1000);

    if (drawnInc > 0) {
      runTransaction(ref(database, "stats/totalPixelsDrawn"), (curr) => {
        return (curr || 0) + drawnInc;
      }).catch(() => {});
    }

    if (poppedInc > 0) {
      runTransaction(ref(database, "stats/totalPixelsPopped"), (curr) => {
        return (curr || 0) + poppedInc;
      }).catch(() => {});
    }
  }, 3500);
}

export function subscribeToFirebaseStats(
  onStats: (stats: GlobalCommunityStats) => void
): () => void {
  const database = getFirebaseDatabase();
  ensureBatchProcessor();

  if (!database) {
    return () => {};
  }

  try {
    const statsRef = ref(database, "stats");
    const unsubscribe = onValue(
      statsRef,
      (snapshot) => {
        const val = snapshot.val();
        if (val) {
          onStats({
            totalPixelsDrawn: Number(val.totalPixelsDrawn || 0),
            totalPixelsPopped: Number(val.totalPixelsPopped || 0),
            totalNotesPlayed: Number(val.totalNotesPlayed || 0),
          });
        }
      },
      (error) => {
        console.warn("Firebase stats read error:", error);
      }
    );

    return () => unsubscribe();
  } catch (err) {
    console.warn("Firebase onValue subscription error:", err);
    return () => {};
  }
}

export function recordPixelDrawn(count = 1) {
  pendingIncrements.drawn += count;
  ensureBatchProcessor();
}

export function recordPixelPopped(count = 1) {
  pendingIncrements.popped += count;
  ensureBatchProcessor();
}
