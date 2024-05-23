import * as idb from "idb";

const DbName = "repeat-db";
const HistoryStoreName = "history";

interface RepeatDb extends idb.DBSchema {
  [HistoryStoreName]: {
    key: string;
    value: PracticeRecord;
  };
}

export default class DbService {
  private _db: idb.IDBPDatabase<RepeatDb>;

  constructor() {
    idb
      .openDB<RepeatDb>(DbName, 1, {
        upgrade(db) {
          db.createObjectStore(HistoryStoreName, {
            keyPath: "subtitleUrl",
          });
        },
      })
      .then((db) => {
        this._db = db;
      });
  }

  async getPracticeRecord(subtitleUrl: string): Promise<PracticeRecord> {
    return await this._db?.get(HistoryStoreName, subtitleUrl);
  }

  async setPracticed(subtitleUrl: string) {
    let record = await this.getPracticeRecord(subtitleUrl);

    this._db?.put(HistoryStoreName, {
      subtitleUrl,
      times: record == null ? 1 : record.times + 1,
      practicedAt: new Date(),
    });
  }
}
