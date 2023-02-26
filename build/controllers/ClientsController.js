"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientsController = void 0;
class ClientsController {
    constructor() {
        this.getClients = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send({ message: 'Get clients' });
        });
        this.setClient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send({ messagte: 'Set Client' });
        });
        this.updateClient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send({ messagte: `Update Client - ${req.params.id}` });
        });
        this.deleteClient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send({ messagte: `Delete Client - ${req.params.id}` });
        });
    }
}
const clientsController = new ClientsController();
exports.clientsController = clientsController;
