/* eslint-disable linebreak-style */
/* eslint-disable no-useless-catch */
import mysql = require('mysql');
import Usuario from '../resources/models/Usuario';
import ObjetoNoEncontrado from './errors/ObjetoNoEncontrado';

export default class AlmacenamientoUsuario {
    private conection: mysql.Connection;

    constructor(databaseConfig: any) {
      this.conection = mysql.createConnection(databaseConfig);
      this.conection.connect((err) => {
        if (err) throw err;
      });
    }

    async crearUsuario(usuario: Usuario): Promise<Usuario> {
      const consulta = 'INSERT INTO usuario(id, rol) VALUES (?, ?)';
      const args = [
        usuario.id,
        usuario.rol,
      ];
      const promesaUsuario: any = await new Promise((resolve, reject) => {
        this.conection.query(consulta, args, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(usuario);
          }
        });
      });

      return promesaUsuario;
    }

    async obtenerUsuario(id: number): Promise<Usuario> {
      const consulta = 'SELECT * FROM usuario WHERE id=?';
      const promesaUsuario: any = await new Promise((resolve, reject) => {
        this.conection.query(consulta, [String(id)], (err, res) => {
          if (err) {
            reject(err);
          } else if (res.length < 1) {
            resolve(new ObjetoNoEncontrado());
          } else {
            const usuario: Usuario = {
              id: res[0].id,
              rol: res[0].rol,
              nombre: '',
              carrera: '',
              codigo: 0,
            };

            resolve(usuario);
          }
        });
      });

      return promesaUsuario;
    }
}
