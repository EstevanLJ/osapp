import { DatabaseConnection } from './database-connection'

var db = null
export default class DatabaseInit {

    constructor() {
        db = DatabaseConnection.getConnection()
        db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
            console.log('Foreign keys turned on')
        );
        this.InitDb()
    }
    
    InitDb() {
        var sql = [
            // `drop TABLE formulario;`,
            `CREATE TABLE IF NOT EXISTS formulario (
                id INTEGER primary key autoincrement,
                
                id_portal INTEGER,
                data_sincronizacao TEXT,
                data_local_cadastro TEXT,
                
                usuario_id INTEGER,
                device_id INTEGER,
                data_atividade TEXT,
                numero_os TEXT,
                hora_inicio TEXT,
                hora_fim TEXT, 
                descricao_atividade TEXT,
                avaliacao_riscos BLOB,
                medidas_controle BLOB,
                fotos BLOB
            );`,
            
        ];

        db.transaction(
            tx => {
                for (var i = 0; i < sql.length; i++) {
                    console.log("execute sql : " + sql[i]);
                    tx.executeSql(sql[i]);
                }
            }, (error) => {
                console.log("error call back : " + JSON.stringify(error));
                console.log(error);
            }, () => {
                console.log("transaction complete call back ");
            }
        );
    }

}