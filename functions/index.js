const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

/* Delete signals older than 15m */
exports.deleteOldSignals = functions.pubsub
    .schedule("* * * * *").onRun(() => {
      const ref = admin.database().ref("signals"); // reference to the items
      const now = Date.now();
      const cutoff = now - 10 * 60 * 1000; // 10m
      const oldItemsQuery = ref.orderByChild("timestamp").endAt(cutoff);
      return oldItemsQuery.once("value", function(snapshot) {
        // create a map with all children that need to be removed
        const updates = {};
        snapshot.forEach(function(child) {
          updates[child.key] = null;
        });
        // execute all updates in one go and return the result
        return ref.update(updates);
      });
    });

/* Delete events older than 5 hours */
exports.deleteOldEvents = functions.pubsub
    .schedule("0 * * * *").onRun(() => {
      const ref = admin.database().ref("events"); // reference to the items
      const now = Date.now();
      const cutoff = now - 5 * 60 * 60 * 1000;
      const oldItemsQuery = ref.orderByChild("timestamp").endAt(cutoff);
      return oldItemsQuery.once("value", function(snapshot) {
        // create a map with all children that need to be removed
        const updates = {};
        snapshot.forEach(function(child) {
          updates[child.key] = null;
        });
        // execute all updates in one go and return the result
        return ref.update(updates);
      });
    });
