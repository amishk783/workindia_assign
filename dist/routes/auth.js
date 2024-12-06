"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("@/controller/auth");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/register", auth_1.signupController);
router.post("/login", auth_1.loginController);
//# sourceMappingURL=auth.js.map