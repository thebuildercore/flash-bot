// // src/lib/wickguard.ts

// export type BotStage =
//   | "standby"
//   | "init"
//   | "wallet"
//   | "mint"
//   | "userAta"
//   | "safeAta"
//   | "delegating"
//   | "userDelegated"
//   | "delegatingSafe"
//   | "safeDelegated"
//   | "syncing"
//   | "verifying"
//   | "active"
//   | "monitoring"
//   | "threat"
//   | "protecting"
//   | "rescuing"
//   | "secured"
//   | "recovery"
//   | "restoring"
//   | "restored"
//   | "complete";

// export type WickPhase =
//   | "standby"
//   | "rescue"
//   | "secured"
//   | "recovery"
//   | "restored";

// export const stageToPhase = (stage: BotStage): WickPhase => {
//   if (
//     stage === "threat" ||
//     stage === "protecting" ||
//     stage === "rescuing"
//   ) return "rescue";

//   if (stage === "secured") return "secured";
//   if (stage === "recovery" || stage === "restoring") return "recovery";
//   if (stage === "restored" || stage === "complete") return "restored";

//   return "standby";
// };

export type BotStage = 
  | "standby" 
  | "wallet" 
  | "mint" 
  | "userAta" 
  | "safeAta" 
  | "delegating" 
  | "userDelegated" 
  | "delegatingSafe" 
  | "safeDelegated" 
  | "syncing" 
  | "verifying" 
  | "active" 
  | "monitoring" 
  | "threat" 
  | "protecting" 
  | "rescuing" 
  | "secured" 
  | "recovery" 
  | "restoring" 
  | "restored" 
  | "complete";

export type Phase = "standby" | "rescue" | "secured" | "recovery" | "restored";

export const stageToPhase = (stage: BotStage): Phase => {
  if (["threat", "protecting", "rescuing"].includes(stage)) return "rescue";
  if (stage === "secured") return "secured";
  if (["recovery", "restoring"].includes(stage)) return "recovery";
  if (["restored", "complete"].includes(stage)) return "restored";
  return "standby";
};