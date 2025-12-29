import { Cpu, CpuFill } from "react-bootstrap-icons";

export function getCpuIcon(cpu: string) {
  switch (cpu) {
    case "Meteor Lake":
        return <Cpu size={18} />;
    case "Arrow Lake":
        return <Cpu size={18} />;
    case "Lunar Lake":
        return <Cpu size={18} />;
    case "Panther Lake":
        return <Cpu size={18} />;
    case "Raptor Lake":
        return <Cpu size={18} />;
    case "Raptor Lake Refresh":
        return <Cpu size={18} />;
    case "Alder Lake":
        return <Cpu size={18} />;
    case "Tiger Lake":
        return <Cpu size={18} />;
    case "Rocket Lake":
        return <Cpu size={18} />;
    // Legacy support for old format
    case "MTL":
        return <Cpu size={18} />;
    case "ARL":
        return <Cpu size={18} />;
    case "LNL":
        return <Cpu size={18} />;
    case "PTL":
        return <Cpu size={18} />;
    default:
        return <CpuFill size={18} />;
  }
}