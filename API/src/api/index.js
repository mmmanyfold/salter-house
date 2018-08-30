import { version, name } from '../../package.json';
import { Router } from 'express';

export default ({ config, db }) => {
  let api = Router();

  api.get('/products', (req, res) => {
    res.json([]);
  });

  // expose API metadata at the root
  api.get('/', (req, res) => {
    res.json({ name, version });
  });

  return api;
}
