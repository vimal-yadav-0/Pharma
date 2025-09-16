import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('events.db');

db.transaction(tx => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, data TEXT)'
  );
});

export function saveEventLocally(event) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO events (id, data) VALUES (?, ?)',
        [event.id, JSON.stringify(event)],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
}

export function getLocalEvents() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM events',
        [],
        (_, { rows }) => {
          const events = [];
          for (let i = 0; i < rows.length; i++) {
            events.push(JSON.parse(rows.item(i).data));
          }
          resolve(events);
        },
        (_, error) => reject(error)
      );
    });
  });
}

export function removeEventLocally(id) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM events WHERE id = ?',
        [id],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
}
