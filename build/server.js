"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const port = 8080;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const clients_routes_1 = __importDefault(require("./routes/clients.routes"));
app.use('/api/clients', clients_routes_1.default);
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
