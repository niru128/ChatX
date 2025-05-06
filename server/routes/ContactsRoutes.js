import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleWare.js";
import { getAllContacts, getContactsForDmLists, searchContacts } from "../controllers/ContactsController.js";


const contactsRoutes  = Router();

contactsRoutes.post("/search", verifyToken, searchContacts);
contactsRoutes.get("/getContactsForDmLists", verifyToken, getContactsForDmLists);
contactsRoutes.get("/get-all-contacts", verifyToken, getAllContacts);

export default contactsRoutes;