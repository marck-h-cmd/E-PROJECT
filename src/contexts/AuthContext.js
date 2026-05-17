'use client';
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLES = void 0;
exports.AuthProvider = AuthProvider;
exports.useAuth = useAuth;
exports.useRequireAuth = useRequireAuth;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var constantes_1 = require("@/lib/constantes");
Object.defineProperty(exports, "ROLES", { enumerable: true, get: function () { return constantes_1.ROLES; } });
var api_client_1 = require("@/lib/api-client");
var AuthContext = (0, react_1.createContext)(undefined);
function persistSession(accessToken, refreshToken, user) {
    if (typeof window === 'undefined')
        return;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    document.cookie = "auth_token=".concat(accessToken, "; path=/; max-age=86400; SameSite=Lax");
}
function clearSession() {
    if (typeof window === 'undefined')
        return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    document.cookie = 'auth_token=; path=/; max-age=0';
}
function AuthProvider(_a) {
    var _this = this;
    var children = _a.children;
    var router = (0, navigation_1.useRouter)();
    var _b = (0, react_1.useState)(null), user = _b[0], setUser = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    (0, react_1.useEffect)(function () {
        try {
            var token = localStorage.getItem('accessToken');
            var raw = localStorage.getItem('user');
            if (token && raw) {
                setUser(JSON.parse(raw));
            }
        }
        catch (_a) {
            clearSession();
        }
        finally {
            setLoading(false);
        }
    }, []);
    var login = (0, react_1.useCallback)(function (email, password) { return __awaiter(_this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, api_client_1.apiRequest)('/api/auth/login', {
                        method: 'POST',
                        body: { email: email, password: password },
                        skipAuth: true,
                    })];
                case 1:
                    res = _a.sent();
                    if (!res.data)
                        throw new Error('Respuesta inválida del servidor');
                    persistSession(res.data.tokens.accessToken, res.data.tokens.refreshToken, res.data.usuario);
                    setUser(res.data.usuario);
                    router.push('/dashboard');
                    return [2 /*return*/];
            }
        });
    }); }, [router]);
    var logout = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, api_client_1.apiPost)('/api/auth/logout')];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 3:
                    clearSession();
                    setUser(null);
                    router.push('/auth/login');
                    return [2 /*return*/];
            }
        });
    }); }, [router]);
    var hasRole = (0, react_1.useCallback)(function () {
        var roles = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            roles[_i] = arguments[_i];
        }
        if (!user || !user.rol)
            return false;
        return roles.includes(user.rol);
    }, [user]);
    var can = (0, react_1.useCallback)(function (permission) {
        if (!user || !user.rol)
            return false;
        var allowedRoles = constantes_1.PERMISOS[permission];
        if (!Array.isArray(allowedRoles))
            return false;
        return allowedRoles.includes(user.rol);
    }, [user]);
    var value = (0, react_1.useMemo)(function () { return ({
        user: user,
        loading: loading,
        isAuthenticated: !!user,
        login: login,
        logout: logout,
        hasRole: hasRole,
        can: can,
    }); }, [user, loading, login, logout, hasRole, can]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
function useAuth() {
    var ctx = (0, react_1.useContext)(AuthContext);
    if (!ctx)
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    return ctx;
}
function useRequireAuth(allowedRoles) {
    var _a = useAuth(), user = _a.user, loading = _a.loading, hasRole = _a.hasRole;
    var router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(function () {
        if (loading)
            return;
        if (!user) {
            router.replace('/auth/login');
            return;
        }
        if (allowedRoles && allowedRoles.length > 0 && !hasRole.apply(void 0, allowedRoles)) {
            router.replace('/auth/acceso-denegado');
        }
    }, [user, loading, allowedRoles, hasRole, router]);
    return { user: user, loading: loading };
}
