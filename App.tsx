import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Fisica from "./pages/Fisica";
import PrimeroMedio from "./pages/PrimeroMedio";
import FisicaMovimiento from "./pages/FisicaMovimiento";
import FisicaEnergia from "./pages/FisicaEnergia";
import FisicaElectricidad from "./pages/FisicaElectricidad";
import FisicaMagnetismo from "./pages/FisicaMagnetismo";
import FisicaOptica from "./pages/FisicaOptica";
import Orientacion from "./pages/Orientacion";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/fisica" component={Fisica} />
      <Route path="/fisica/primero-medio" component={PrimeroMedio} />
      <Route path="/fisica/movimiento" component={FisicaMovimiento} />
      <Route path="/fisica/energia" component={FisicaEnergia} />
      <Route path="/fisica/electricidad" component={FisicaElectricidad} />
      <Route path="/fisica/magnetismo" component={FisicaMagnetismo} />
      <Route path="/fisica/optica" component={FisicaOptica} />
      <Route path="/orientacion" component={Orientacion} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
