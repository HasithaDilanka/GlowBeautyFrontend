import express from 'express';
import {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact
} from '../controllers/contactController.js';

const contactRouter = express.Router();

// POST /api/contacts - Create new contact
contactRouter.post('/', createContact);

// GET /api/contacts - Get all contacts
contactRouter.get('/', getAllContacts);

// GET /api/contacts/:id - Get contact by ID
contactRouter.get('/:id', getContactById);

// DELETE /api/contacts/:id - Delete contact
contactRouter.delete('/:id', deleteContact);

export default contactRouter;