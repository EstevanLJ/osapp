import { DatabaseConnection } from './database-connection'

const table = "formulario"
const db = DatabaseConnection.getConnection()

export default class FormularioCrud {
    static insert(param) {
        return new Promise((resolve, reject) => db.transaction(
            tx => {
                tx.executeSql(`insert into ${table} (
                        data_local_cadastro, 

                        usuario_id,
                        device_id,
                        data_atividade,
                        hora_inicio,
                        hora_fim,
                        numero_os,
                        descricao_atividade,
                        avaliacao_riscos,
                        medidas_controle,
                        fotos
                    ) 
                    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        param.data_local_cadastro,
                        param.usuario_id,
                        param.device_id,
                        param.data_atividade,
                        param.hora_inicio,
                        param.hora_fim,
                        param.numero_os,
                        param.descricao_atividade,
                        param.avaliacao_riscos,
                        param.medidas_controle,
                        param.fotos,
                    ],
                    (_, { insertId, rows }) => {
                        console.log("id insert: " + insertId);
                        resolve(insertId)
                    }), (sqlError) => {
                        reject(sqlError);
                    }
            }, (txError) => {
                reject(txError)
            }));
    }

    static sincronizado(id, idPortal, dataSincronizacao) {
        return new Promise((resolve, reject) => db.transaction(
            tx => {
                tx.executeSql(`update ${table} set id_portal = ?, data_sincronizacao = ? where id = ?`,
                    [
                        idPortal,
                        dataSincronizacao,
                        id
                    ],
                    (_, { insertId, rows }) => {
                        resolve()
                    }), (sqlError) => {
                        reject(sqlError);
                    }
            }, (txError) => {
                reject(txError)
            }));
    }

    
    static naoSincronizados() {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${table} where id_portal is null`, [], (_, { rows }) => {
                resolve(rows)
            }), (sqlError) => {
                reject(sqlError);
            }
        }, (txError) => {
            reject(txError);
        }))
    }

    static findAll() {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${table}`, [], (_, { rows }) => {
                resolve(rows)
            }), (sqlError) => {
                reject(sqlError);
            }
        }, (txError) => {
            reject(txError);
        }))
    }


}