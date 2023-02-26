"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ClientsController_1 = require("../controllers/ClientsController");
const router = express_1.default.Router();
router.get('/', ClientsController_1.clientsController.getClients);
router.post('/', ClientsController_1.clientsController.setClient);
router.put('/:id', ClientsController_1.clientsController.updateClient);
router.delete('/:id', ClientsController_1.clientsController.deleteClient);
exports.default = router;
