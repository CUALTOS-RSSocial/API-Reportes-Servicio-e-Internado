const config = {
  ambiente: process.env.AMBIENTE || 'develop',
  host: 'localhost',
  port: 9000,
  database: {
    user: 'root',
    password: 'dolphR0ot',
    name: 'Servicio_Medicina',
  },
  autenticacion: {
    algoritmo: process.env.ALGORITMO_AUTENTICACION || 'HS256',
    semilla: process.env.SEMILLA_AUTENTICACION || 'semillapruebaJKnas490nflz7y1g083gfdjlfuq49yfvmnp934yraiesjfn1lo4780efhdsafkjdq24t0eg',
  },
  SIIAUKey: process.env.SIIAU_LOGIN_KEY || '',
  SIIAUHost: 'https://ms.mw.siiau.udg.mx:443',
  SIIAUPath: '/WSValidaUsuarios/ValidaUsuarios',
};

export default config;
