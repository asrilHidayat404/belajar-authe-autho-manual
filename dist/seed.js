var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var bcrypt = require("bcryptjs");
var PrismaClient = require("../src/generated/prisma").PrismaClient; // path relatif
var prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var roles, _i, roles_1, role_name, users, _a, users_1, u, role, hashedPassword, posts, _b, posts_1, p, user;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    roles = ["Admin", "Mahasiswa"];
                    _i = 0, roles_1 = roles;
                    _c.label = 1;
                case 1:
                    if (!(_i < roles_1.length)) return [3 /*break*/, 4];
                    role_name = roles_1[_i];
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { role_name: role_name },
                            update: {},
                            create: { role_name: role_name },
                        })];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log("Roles seeded!");
                    users = [
                        { username: "Alice", email: "alice@gmail.com", role_name: "Mahasiswa" },
                        { username: "Admin", email: "admin@gmail.com", role_name: "Admin" },
                    ];
                    _a = 0, users_1 = users;
                    _c.label = 5;
                case 5:
                    if (!(_a < users_1.length)) return [3 /*break*/, 10];
                    u = users_1[_a];
                    return [4 /*yield*/, prisma.role.findUnique({ where: { role_name: u.role_name } })];
                case 6:
                    role = _c.sent();
                    if (!role)
                        throw new Error("Role ".concat(u.role_name, " not found"));
                    return [4 /*yield*/, bcrypt.hash("password", 10)];
                case 7:
                    hashedPassword = _c.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: u.email },
                            update: {},
                            create: {
                                username: u.username,
                                email: u.email,
                                password: hashedPassword,
                                role_id: role.id_role,
                            },
                        })];
                case 8:
                    _c.sent();
                    _c.label = 9;
                case 9:
                    _a++;
                    return [3 /*break*/, 5];
                case 10:
                    console.log("Users seeded!");
                    posts = [
                        { title: "Post 1", content: "Konten Post 1", user_email: "alice@gmail.com" },
                        { title: "Post 2", content: "Konten Post 2", user_email: "admin@gmail.com" },
                    ];
                    _b = 0, posts_1 = posts;
                    _c.label = 11;
                case 11:
                    if (!(_b < posts_1.length)) return [3 /*break*/, 15];
                    p = posts_1[_b];
                    return [4 /*yield*/, prisma.user.findUnique({ where: { email: p.user_email } })];
                case 12:
                    user = _c.sent();
                    if (!user)
                        throw new Error("User ".concat(p.user_email, " not found"));
                    return [4 /*yield*/, prisma.post.upsert({
                            where: { title: p.title },
                            update: {},
                            create: {
                                title: p.title,
                                content: p.content,
                                user_id: user.id_user,
                            },
                        })];
                case 13:
                    _c.sent();
                    _c.label = 14;
                case 14:
                    _b++;
                    return [3 /*break*/, 11];
                case 15:
                    console.log("Posts seeded!");
                    return [2 /*return*/];
            }
        });
    });
}
// ===== Run Seeder =====
main()
    .catch(console.error)
    .finally(function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
