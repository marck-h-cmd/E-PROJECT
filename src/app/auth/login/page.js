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
exports.default = LoginPage;
var react_1 = require("react");
var AuthContext_1 = require("@/contexts/AuthContext");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var Alerta_1 = require("@/components/ui/Alerta");
var PantallaCarga_1 = require("@/components/ui/PantallaCarga");
var lucide_react_1 = require("lucide-react");
function LoginPage() {
    var _this = this;
    var _a = (0, AuthContext_1.useAuth)(), login = _a.login, authLoading = _a.loading;
    var _b = (0, react_1.useState)(''), email = _b[0], setEmail = _b[1];
    var _c = (0, react_1.useState)(''), password = _c[0], setPassword = _c[1];
    var _d = (0, react_1.useState)(''), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)(false), loading = _e[0], setLoading = _e[1];
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setError('');
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, login(email, password)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1.message || 'Error al iniciar sesión. Verifique sus credenciales.');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    if (authLoading)
        return <PantallaCarga_1.PantallaCarga />;
    return (<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white p-3 shadow-md">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Escudo_UNT.png/220px-Escudo_UNT.png" alt="UNT Logo" className="h-full w-auto object-contain"/>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900">
            UNT Horarios
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Escuela de Ingeniería de Sistemas
          </p>
        </div>

        <div className="mt-8 rounded-xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (<Alerta_1.Alerta tipo="error" mensaje={error}/>)}
            
            <div className="space-y-4">
              <div>
                <label_1.Label htmlFor="email">Correo Electrónico / Usuario</label_1.Label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <lucide_react_1.User className="h-5 w-5 text-gray-400"/>
                  </div>
                  <input_1.Input id="email" name="email" type="text" autoComplete="email" required value={email} onChange={function (e) { return setEmail(e.target.value); }} className="pl-10" placeholder="admin@unitru.edu.pe"/>
                </div>
              </div>

              <div>
                <label_1.Label htmlFor="password">Contraseña</label_1.Label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <lucide_react_1.Lock className="h-5 w-5 text-gray-400"/>
                  </div>
                  <input_1.Input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={function (e) { return setPassword(e.target.value); }} className="pl-10" placeholder="••••••••"/>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"/>
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  ¿Olvidó su contraseña?
                </a>
              </div>
            </div>

            <div>
              <button_1.Button type="submit" disabled={loading} className="group relative flex w-full justify-center bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                {loading ? (<span className="flex items-center gap-2">
                    <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Autenticando...
                  </span>) : (<span className="flex items-center gap-2">
                    Iniciar Sesión
                    <lucide_react_1.ArrowRight className="h-4 w-4"/>
                  </span>)}
              </button_1.Button>
            </div>
          </form>
          
          <div className="mt-6 border-t pt-6">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Credenciales de prueba</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Usuario: <code className="font-bold">admin@unitru.edu.pe</code></li>
                      <li>Contraseña: <code className="font-bold">admin123</code></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Universidad Nacional de Trujillo. Todos los derechos reservados.
        </p>
      </div>
    </div>);
}
