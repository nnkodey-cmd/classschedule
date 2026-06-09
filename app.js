// tmp/entry.jsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { getDatabase, ref, set, get, remove, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var GRADES = [
  { id: "e1", label: "\u5C0F1", type: "e", periods: 6, days: 5 },
  { id: "e2", label: "\u5C0F2", type: "e", periods: 6, days: 5 },
  { id: "e3", label: "\u5C0F3", type: "e", periods: 6, days: 5 },
  { id: "e4", label: "\u5C0F4", type: "e", periods: 6, days: 5 },
  { id: "e5", label: "\u5C0F5", type: "e", periods: 6, days: 5 },
  { id: "e6", label: "\u5C0F6", type: "e", periods: 6, days: 5 },
  { id: "j1", label: "\u4E2D1", type: "j", periods: 6, days: 5 },
  { id: "j2", label: "\u4E2D2", type: "j", periods: 6, days: 5 },
  { id: "j3", label: "\u4E2D3", type: "j", periods: 6, days: 5 }
];
var DAYS = ["\u6708", "\u706B", "\u6C34", "\u6728", "\u91D1"];
function buildDefaultPeriodSettings() {
  const settings = {};
  GRADES.forEach((g) => {
    const defaultP = g.id === "e1" || g.id === "e2" ? 5 : g.periods;
    settings[g.id] = [0, 1, 2, 3, 4].map(() => defaultP);
  });
  return settings;
}
function getActivePeriods(grade, periodSettings, dayIndex) {
  return periodSettings?.[grade.id]?.[dayIndex] ?? grade.periods;
}
var ANNUAL_HOURS_DEFAULT = {
  e1: { \u56FD\u8A9E: 306, \u7B97\u6570: 136, \u751F\u6D3B: 102, \u97F3\u697D: 68, \u56F3\u5DE5: 68, \u4F53\u80B2: 102, \u9053\u5FB3: 34, \u5B66\u6D3B: 34 },
  e2: { \u56FD\u8A9E: 315, \u7B97\u6570: 175, \u751F\u6D3B: 105, \u97F3\u697D: 70, \u56F3\u5DE5: 70, \u4F53\u80B2: 105, \u9053\u5FB3: 35, \u5B66\u6D3B: 35 },
  e3: { \u56FD\u8A9E: 245, \u7B97\u6570: 175, \u793E\u4F1A: 70, \u7406\u79D1: 90, \u97F3\u697D: 60, \u56F3\u5DE5: 60, \u4F53\u80B2: 105, \u9053\u5FB3: 35, \u7DCF\u5408: 70, \u5916\u56FD\u8A9E: 70, \u5B66\u6D3B: 35 },
  e4: { \u56FD\u8A9E: 245, \u7B97\u6570: 175, \u793E\u4F1A: 90, \u7406\u79D1: 105, \u97F3\u697D: 60, \u56F3\u5DE5: 60, \u4F53\u80B2: 105, \u9053\u5FB3: 35, \u7DCF\u5408: 70, \u5916\u56FD\u8A9E: 70, \u5B66\u6D3B: 35 },
  e5: { \u56FD\u8A9E: 175, \u7B97\u6570: 175, \u793E\u4F1A: 100, \u7406\u79D1: 105, \u97F3\u697D: 50, \u56F3\u5DE5: 50, \u4F53\u80B2: 90, \u9053\u5FB3: 35, \u7DCF\u5408: 70, \u5916\u56FD\u8A9E: 70, \u5BB6\u5EAD: 60, \u5B66\u6D3B: 35 },
  e6: { \u56FD\u8A9E: 175, \u7B97\u6570: 175, \u793E\u4F1A: 105, \u7406\u79D1: 105, \u97F3\u697D: 50, \u56F3\u5DE5: 50, \u4F53\u80B2: 90, \u9053\u5FB3: 35, \u7DCF\u5408: 70, \u5916\u56FD\u8A9E: 70, \u5BB6\u5EAD: 55, \u5B66\u6D3B: 35 },
  j1: { \u56FD\u8A9E: 140, \u6570\u5B66: 140, \u82F1\u8A9E: 140, \u793E\u4F1A: 105, \u7406\u79D1: 105, \u97F3\u697D: 45, \u7F8E\u8853: 45, \u6280\u8853: 35, \u5BB6\u5EAD: 35, \u4F53\u80B2: 105, \u9053\u5FB3: 35, \u7DCF\u5408: 50, \u5B66\u6D3B: 35 },
  j2: { \u56FD\u8A9E: 140, \u6570\u5B66: 105, \u82F1\u8A9E: 140, \u793E\u4F1A: 105, \u7406\u79D1: 140, \u97F3\u697D: 35, \u7F8E\u8853: 35, \u6280\u8853: 35, \u5BB6\u5EAD: 35, \u4F53\u80B2: 105, \u9053\u5FB3: 35, \u7DCF\u5408: 70, \u5B66\u6D3B: 35 },
  j3: { \u56FD\u8A9E: 105, \u6570\u5B66: 140, \u82F1\u8A9E: 140, \u793E\u4F1A: 140, \u7406\u79D1: 140, \u97F3\u697D: 35, \u7F8E\u8853: 35, \u6280\u8853: 35, \u5BB6\u5EAD: 35, \u4F53\u80B2: 105, \u9053\u5FB3: 35, \u7DCF\u5408: 35, \u5B66\u6D3B: 35 }
};
var ALL_SUBJECTS = [
  { name: "\u56FD\u8A9E", color: "#FF6B6B", hex: [255, 107, 107], emoji: "\u{1F4D6}" },
  { name: "\u66F8\u5199", color: "#FF8C69", hex: [255, 140, 105], emoji: "\u270F\uFE0F" },
  { name: "\u7B97\u6570", color: "#4ECDC4", hex: [78, 205, 196], emoji: "\u{1F522}" },
  { name: "\u6570\u5B66", color: "#4ECDC4", hex: [78, 205, 196], emoji: "\u{1F4D0}" },
  { name: "\u751F\u6D3B", color: "#95E77E", hex: [149, 231, 126], emoji: "\u{1F33F}" },
  { name: "\u793E\u4F1A", color: "#FFB347", hex: [255, 179, 71], emoji: "\u{1F30F}" },
  { name: "\u7406\u79D1", color: "#7BED9F", hex: [123, 237, 159], emoji: "\u{1F52C}" },
  { name: "\u97F3\u697D", color: "#FFD93D", hex: [255, 217, 61], emoji: "\u{1F3B5}" },
  { name: "\u56F3\u5DE5", color: "#FF9FF3", hex: [255, 159, 243], emoji: "\u{1F3A8}" },
  { name: "\u7F8E\u8853", color: "#FF9FF3", hex: [255, 159, 243], emoji: "\u{1F3A8}" },
  { name: "\u4F53\u80B2", color: "#54A0FF", hex: [84, 160, 255], emoji: "\u26BD" },
  { name: "\u5BB6\u5EAD", color: "#FFC0CB", hex: [255, 192, 203], emoji: "\u{1F9F5}" },
  { name: "\u5916\u56FD\u8A9E", color: "#A29BFE", hex: [162, 155, 254], emoji: "\u{1F310}" },
  { name: "\u82F1\u8A9E", color: "#A29BFE", hex: [162, 155, 254], emoji: "\u{1F310}" },
  { name: "\u9053\u5FB3", color: "#FFA502", hex: [255, 165, 2], emoji: "\u2764\uFE0F" },
  { name: "\u7DCF\u5408", color: "#B2BBBE", hex: [178, 187, 190], emoji: "\u{1F300}" },
  { name: "\u6280\u8853", color: "#74B9FF", hex: [116, 185, 255], emoji: "\u{1F527}" },
  { name: "\u5B66\u6D3B", color: "#DFE6E9", hex: [223, 230, 233], emoji: "\u{1F465}" },
  { name: "\u305D\u306E\u4ED6", color: "#95A5A6", hex: [149, 165, 166], emoji: "\u{1F4CC}" }
];
function subjectInfo(name) {
  return ALL_SUBJECTS.find((s) => s.name === name) || { name, color: "#ccc", hex: [200, 200, 200], emoji: "\u{1F4CC}" };
}
function getGradeSubjectNames(gradeId) {
  if (gradeId === "e1" || gradeId === "e2") return ["\u56FD\u8A9E", "\u66F8\u5199", "\u7B97\u6570", "\u751F\u6D3B", "\u97F3\u697D", "\u56F3\u5DE5", "\u4F53\u80B2", "\u9053\u5FB3", "\u5B66\u6D3B", "\u305D\u306E\u4ED6"];
  if (gradeId.startsWith("e")) return ["\u56FD\u8A9E", "\u66F8\u5199", "\u7B97\u6570", "\u793E\u4F1A", "\u7406\u79D1", "\u97F3\u697D", "\u56F3\u5DE5", "\u4F53\u80B2", "\u5BB6\u5EAD", "\u5916\u56FD\u8A9E", "\u9053\u5FB3", "\u7DCF\u5408", "\u5B66\u6D3B", "\u305D\u306E\u4ED6"];
  return ["\u56FD\u8A9E", "\u66F8\u5199", "\u6570\u5B66", "\u82F1\u8A9E", "\u793E\u4F1A", "\u7406\u79D1", "\u97F3\u697D", "\u7F8E\u8853", "\u6280\u8853", "\u5BB6\u5EAD", "\u4F53\u80B2", "\u9053\u5FB3", "\u7DCF\u5408", "\u5B66\u6D3B", "\u305D\u306E\u4ED6"];
}
var WEEKLY_ALLOC = {
  e1: { \u56FD\u8A9E: 8, \u7B97\u6570: 4, \u751F\u6D3B: 3, \u97F3\u697D: 2, \u56F3\u5DE5: 2, \u4F53\u80B2: 3, \u9053\u5FB3: 1, \u5B66\u6D3B: 1 },
  e2: { \u56FD\u8A9E: 8, \u7B97\u6570: 5, \u751F\u6D3B: 3, \u97F3\u697D: 2, \u56F3\u5DE5: 2, \u4F53\u80B2: 3, \u9053\u5FB3: 1, \u5B66\u6D3B: 1 },
  e3: { \u56FD\u8A9E: 7, \u7B97\u6570: 5, \u793E\u4F1A: 2, \u7406\u79D1: 3, \u97F3\u697D: 2, \u56F3\u5DE5: 2, \u4F53\u80B2: 3, \u9053\u5FB3: 1, \u7DCF\u5408: 2, \u5916\u56FD\u8A9E: 2, \u5B66\u6D3B: 1 },
  e4: { \u56FD\u8A9E: 6, \u7B97\u6570: 5, \u793E\u4F1A: 3, \u7406\u79D1: 3, \u97F3\u697D: 2, \u56F3\u5DE5: 2, \u4F53\u80B2: 3, \u9053\u5FB3: 1, \u7DCF\u5408: 2, \u5916\u56FD\u8A9E: 2, \u5B66\u6D3B: 1 },
  e5: { \u56FD\u8A9E: 5, \u7B97\u6570: 5, \u793E\u4F1A: 3, \u7406\u79D1: 3, \u97F3\u697D: 1, \u56F3\u5DE5: 2, \u4F53\u80B2: 3, \u5BB6\u5EAD: 2, \u9053\u5FB3: 1, \u7DCF\u5408: 2, \u5916\u56FD\u8A9E: 2, \u5B66\u6D3B: 1 },
  e6: { \u56FD\u8A9E: 5, \u7B97\u6570: 5, \u793E\u4F1A: 3, \u7406\u79D1: 3, \u97F3\u697D: 1, \u56F3\u5DE5: 2, \u4F53\u80B2: 3, \u5BB6\u5EAD: 2, \u9053\u5FB3: 1, \u7DCF\u5408: 2, \u5916\u56FD\u8A9E: 2, \u5B66\u6D3B: 1 },
  j1: { \u56FD\u8A9E: 4, \u6570\u5B66: 4, \u82F1\u8A9E: 4, \u793E\u4F1A: 3, \u7406\u79D1: 3, \u97F3\u697D: 1, \u7F8E\u8853: 1, \u6280\u8853: 1, \u5BB6\u5EAD: 1, \u4F53\u80B2: 3, \u9053\u5FB3: 1, \u7DCF\u5408: 2, \u5B66\u6D3B: 1 },
  j2: { \u56FD\u8A9E: 4, \u6570\u5B66: 4, \u82F1\u8A9E: 4, \u793E\u4F1A: 3, \u7406\u79D1: 4, \u97F3\u697D: 1, \u7F8E\u8853: 1, \u6280\u8853: 1, \u5BB6\u5EAD: 1, \u4F53\u80B2: 3, \u9053\u5FB3: 1, \u7DCF\u5408: 2, \u5B66\u6D3B: 1 },
  j3: { \u56FD\u8A9E: 4, \u6570\u5B66: 4, \u82F1\u8A9E: 4, \u793E\u4F1A: 4, \u7406\u79D1: 4, \u97F3\u697D: 1, \u7F8E\u8853: 1, \u6280\u8853: 1, \u5BB6\u5EAD: 1, \u4F53\u80B2: 3, \u9053\u5FB3: 1, \u7DCF\u5408: 1, \u5B66\u6D3B: 1 }
};
var EVENT_TYPES = [
  { id: "holiday", label: "\u632F\u66FF\u4F11\u65E5", color: "#FF4757", emoji: "\u{1F534}" },
  { id: "sports", label: "\u904B\u52D5\u4F1A", color: "#FF6B81", emoji: "\u{1F3C3}" },
  { id: "fieldtrip", label: "\u9060\u8DB3", color: "#7BED9F", emoji: "\u{1F392}" },
  { id: "excursion", label: "\u4FEE\u5B66\u65C5\u884C", color: "#54A0FF", emoji: "\u2708\uFE0F" },
  { id: "parentday", label: "\u53C2\u89B3\u65E5", color: "#FFD93D", emoji: "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}" },
  { id: "exam", label: "\u30C6\u30B9\u30C8", color: "#A29BFE", emoji: "\u{1F4DD}" },
  { id: "graduation", label: "\u5352\u696D\u5F0F", color: "#FFA502", emoji: "\u{1F393}" },
  { id: "ceremony", label: "\u5165\u5B66\u5F0F", color: "#FF9FF3", emoji: "\u{1F338}" },
  { id: "cleanup", label: "\u5927\u6383\u9664", color: "#B2BBBE", emoji: "\u{1F9F9}" },
  { id: "other", label: "\u305D\u306E\u4ED6", color: "#636e72", emoji: "\u{1F4CC}" }
];
var ALL_DAYS_LABELS = ["\u6708", "\u706B", "\u6C34", "\u6728", "\u91D1", "\u571F", "\u65E5"];
function isSchoolDay(d) {
  return d <= 4;
}
function eventTypeInfo(id) {
  return EVENT_TYPES.find((e) => e.id === id) || EVENT_TYPES[EVENT_TYPES.length - 1];
}
var DEFAULT_TEACHERS = [
  {
    id: "t1",
    name: "A\u5148\u751F",
    color: "#FF6B6B",
    assignments: [{ gradeId: "e1", subject: "\u4F53\u80B2" }, { gradeId: "e2", subject: "\u4F53\u80B2" }],
    // ③ 小3・小4は合同体育
    jointGroups: [{ gradeIds: ["e3", "e4"], subject: "\u4F53\u80B2", label: "3\u30FB4\u5E74\u5408\u540C\u4F53\u80B2" }]
  },
  {
    id: "t2",
    name: "B\u5148\u751F",
    color: "#4ECDC4",
    assignments: [{ gradeId: "e1", subject: "\u97F3\u697D" }, { gradeId: "e2", subject: "\u97F3\u697D" }, { gradeId: "e3", subject: "\u97F3\u697D" }, { gradeId: "e4", subject: "\u97F3\u697D" }, { gradeId: "e5", subject: "\u97F3\u697D" }, { gradeId: "e6", subject: "\u97F3\u697D" }],
    jointGroups: []
  },
  {
    id: "t3",
    name: "C\u5148\u751F",
    color: "#A29BFE",
    assignments: [{ gradeId: "e3", subject: "\u5916\u56FD\u8A9E" }, { gradeId: "e4", subject: "\u5916\u56FD\u8A9E" }, { gradeId: "e5", subject: "\u5916\u56FD\u8A9E" }, { gradeId: "e6", subject: "\u5916\u56FD\u8A9E" }, { gradeId: "j1", subject: "\u82F1\u8A9E" }, { gradeId: "j2", subject: "\u82F1\u8A9E" }, { gradeId: "j3", subject: "\u82F1\u8A9E" }],
    jointGroups: []
  },
  {
    id: "t4",
    name: "D\u5148\u751F",
    color: "#FFB347",
    assignments: [{ gradeId: "j1", subject: "\u4F53\u80B2" }, { gradeId: "j2", subject: "\u4F53\u80B2" }, { gradeId: "j3", subject: "\u4F53\u80B2" }, { gradeId: "e5", subject: "\u4F53\u80B2" }, { gradeId: "e6", subject: "\u4F53\u80B2" }],
    jointGroups: []
  },
  {
    id: "t5",
    name: "E\u5148\u751F",
    color: "#7BED9F",
    assignments: [{ gradeId: "j1", subject: "\u7406\u79D1" }, { gradeId: "j2", subject: "\u7406\u79D1" }, { gradeId: "j3", subject: "\u7406\u79D1" }],
    jointGroups: []
  }
];
function buildTeacherMap(teachers) {
  const map = {};
  (teachers || []).forEach((t) => {
    (t.assignments || []).forEach(({ gradeId, subject }) => {
      map[`${gradeId}::${subject}`] = t.id;
    });
    (t.jointGroups || []).forEach(({ gradeIds, subject }) => {
      (gradeIds || []).forEach((gid) => {
        map[`${gid}::${subject}`] = t.id;
      });
    });
  });
  return map;
}
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function generateAllTimetables(teachers, events = [], weekNum = 1, periodSettings = null) {
  const teacherMap = buildTeacherMap(teachers);
  const blockedDays = {};
  GRADES.forEach((g) => {
    blockedDays[g.id] = /* @__PURE__ */ new Set();
  });
  events.filter((e) => e.weekNum === weekNum).forEach((ev) => {
    ev.days.filter((d) => isSchoolDay(d)).forEach((d) => {
      const targets = ev.gradeIds && ev.gradeIds.length > 0 ? ev.gradeIds : GRADES.map((g) => g.id);
      targets.forEach((gid) => {
        if (blockedDays[gid]) blockedDays[gid].add(d);
      });
    });
  });
  const result = {};
  GRADES.forEach((g) => {
    result[g.id] = Array.from({ length: g.days }, () => Array(g.periods).fill(null));
  });
  const teacherUsed = {};
  teachers.forEach((t) => {
    teacherUsed[t.id] = Array.from({ length: 5 }, () => Array(6).fill(false));
  });
  GRADES.forEach((grade) => {
    const { id: gid, periods, days } = grade;
    const alloc = WEEKLY_ALLOC[gid] || {};
    const total = periods * days;
    const pool = [];
    Object.entries(alloc).forEach(([name, count]) => {
      for (let i = 0; i < count && pool.length < total; i++) pool.push(name);
    });
    while (pool.length < total) pool.push(Object.keys(alloc)[0] || "\u56FD\u8A9E");
    pool.splice(total);
    shuffle(pool);
    const teacherSlots = [], freeSlots = [];
    pool.forEach((sub) => {
      const tid = teacherMap[`${gid}::${sub}`];
      if (tid) teacherSlots.push({ subject: sub, teacherId: tid });
      else freeSlots.push(sub);
    });
    const slots = [];
    for (let d = 0; d < days; d++) {
      const ap = getActivePeriods(grade, periodSettings, d);
      for (let p = 0; p < ap; p++) if (!blockedDays[gid].has(d)) slots.push({ d, p });
    }
    shuffle(slots);
    const placed = /* @__PURE__ */ new Set();
    for (const { subject, teacherId } of teacherSlots) {
      let ok = false;
      for (const { d, p } of slots) {
        const key = `${d},${p}`;
        if (placed.has(key) || teacherUsed[teacherId][d][p]) continue;
        result[gid][d][p] = subject;
        teacherUsed[teacherId][d][p] = true;
        placed.add(key);
        ok = true;
        break;
      }
      if (!ok) {
        for (const { d, p } of slots) {
          const key = `${d},${p}`;
          if (placed.has(key)) continue;
          result[gid][d][p] = subject;
          placed.add(key);
          break;
        }
      }
    }
    let fi = 0;
    for (const { d, p } of slots) {
      if (result[gid][d][p] !== null) continue;
      result[gid][d][p] = freeSlots[fi++] || "\u56FD\u8A9E";
    }
  });
  const timetables = {};
  GRADES.forEach((grade) => {
    const { id: gid, periods, days } = grade;
    const grid = [];
    for (let d = 0; d < days; d++) {
      const col = [];
      const ap = getActivePeriods(grade, periodSettings, d);
      for (let p = 0; p < periods; p++) {
        if (p >= ap) {
          col.push({ name: "", color: "#F0F0F0", hex: [240, 240, 240], emoji: "", teacherId: null, isEvent: false, isEmpty: true });
          continue;
        }
        if (blockedDays[gid].has(d)) {
          const ev = events.find((e) => e.weekNum === weekNum && e.days.includes(d) && (eventTypeInfo(e.typeId).blockAll || e.gradeIds && e.gradeIds.includes(gid)));
          const et = ev ? eventTypeInfo(ev.typeId) : null;
          col.push({ name: "\u884C\u4E8B", color: et?.color || "#ccc", hex: [200, 200, 200], emoji: et?.emoji || "\u{1F4CC}", teacherId: null, isEvent: true, eventLabel: ev ? et?.label : "\u884C\u4E8B" });
        } else {
          const name = result[gid][d][p] || "\u56FD\u8A9E";
          col.push({ ...subjectInfo(name), teacherId: teacherMap[`${gid}::${name}`] || null, isEvent: false });
        }
      }
      grid.push(col);
    }
    timetables[gid] = grid;
  });
  return timetables;
}
function applyEventsToBase(baseTT, teachers, events = [], weekNum = 1, periodSettings = null) {
  const teacherMap = buildTeacherMap(teachers);
  const blockedDays = {};
  GRADES.forEach((g) => {
    blockedDays[g.id] = /* @__PURE__ */ new Set();
  });
  events.filter((e) => e.weekNum === weekNum).forEach((ev) => {
    ev.days.filter((d) => isSchoolDay(d)).forEach((d) => {
      const targets = ev.gradeIds && ev.gradeIds.length > 0 ? ev.gradeIds : GRADES.map((g) => g.id);
      targets.forEach((gid) => {
        if (blockedDays[gid]) blockedDays[gid].add(d);
      });
    });
  });
  const result = {};
  GRADES.forEach((grade) => {
    const { id: gid, periods, days } = grade;
    const baseGrid = baseTT[gid];
    if (!baseGrid) {
      result[gid] = Array.from({ length: days }, () => Array(periods).fill(null)).map((col) => col.map(() => ({ ...subjectInfo("\u56FD\u8A9E"), teacherId: null, isEvent: false })));
      return;
    }
    const grid = [];
    for (let d = 0; d < days; d++) {
      const col = [];
      const activePeriods = getActivePeriods(grade, periodSettings, d);
      for (let p = 0; p < periods; p++) {
        if (p >= activePeriods) {
          col.push({ name: "", color: "#F0F0F0", hex: [240, 240, 240], emoji: "", teacherId: null, isEvent: false, isEmpty: true });
          continue;
        }
        if (blockedDays[gid].has(d)) {
          const ev = events.find((e) => e.weekNum === weekNum && e.days.includes(d) && (e.gradeIds?.includes(gid) || e.gradeIds && e.gradeIds.length === 0));
          const et = ev ? eventTypeInfo(ev.typeId) : null;
          col.push({ name: "\u884C\u4E8B", color: et?.color || "#ccc", hex: [200, 200, 200], emoji: et?.emoji || "\u{1F4CC}", teacherId: null, isEvent: true, eventLabel: et?.label || "\u884C\u4E8B" });
        } else {
          const cell = baseGrid[d]?.[p];
          if (cell) {
            const name = typeof cell === "string" ? cell : cell.name;
            col.push({ ...subjectInfo(name), teacherId: teacherMap[`${gid}::${name}`] || null, isEvent: false });
          } else {
            col.push({ ...subjectInfo("\u56FD\u8A9E"), teacherId: null, isEvent: false });
          }
        }
      }
      grid.push(col);
    }
    result[gid] = grid;
  });
  return result;
}
function detectConflicts(timetables, teachers) {
  const teacherMap = buildTeacherMap(teachers);
  const usage = {};
  (teachers || []).forEach((t) => {
    usage[t.id] = {};
  });
  GRADES.forEach((grade) => {
    const tt = timetables?.[grade.id];
    if (!tt || !Array.isArray(tt)) return;
    tt.forEach((dayArr, d) => {
      if (!Array.isArray(dayArr)) return;
      dayArr.forEach((cell, p) => {
        if (!cell || cell.isEvent || cell.isEmpty) return;
        const tid = teacherMap[`${grade.id}::${cell.name}`];
        if (!tid) return;
        const key = `${d},${p}`;
        if (!usage[tid]) usage[tid] = {};
        if (!usage[tid][key]) usage[tid][key] = [];
        usage[tid][key].push(grade.id);
      });
    });
  });
  const conflicts = [];
  Object.entries(usage).forEach(([tid, slots]) => Object.entries(slots).forEach(([key, gradeIds]) => {
    if (gradeIds.length > 1) {
      const [d, p] = key.split(",").map(Number);
      conflicts.push({ teacherId: tid, day: d, period: p, gradeIds });
    }
  }));
  return conflicts;
}
function calcAnnualProgress(weeks, annualHours) {
  const progress = {};
  GRADES.forEach((grade) => {
    progress[grade.id] = {};
    const targets = annualHours[grade.id] || {};
    Object.entries(targets).forEach(([sub, target]) => {
      progress[grade.id][sub] = { done: 0, target, pct: 0 };
    });
  });
  weeks.forEach((week) => {
    if (!week.timetables) return;
    GRADES.forEach((grade) => {
      const grid = week.timetables[grade.id];
      if (!grid) return;
      grid.forEach((dayArr) => dayArr.forEach((cell) => {
        if (!cell || cell.isEvent || cell.name === "\u884C\u4E8B") return;
        if (progress[grade.id][cell.name]) progress[grade.id][cell.name].done++;
      }));
    });
  });
  GRADES.forEach((grade) => {
    Object.values(progress[grade.id]).forEach((v) => {
      v.pct = v.target > 0 ? Math.min(100, Math.round(v.done / v.target * 100)) : 0;
    });
  });
  return progress;
}
function serializeTimetables(timetables) {
  const out = {};
  Object.entries(timetables).forEach(([gid, grid]) => {
    out[gid] = grid.map((day) => day.map((cell) => ({ name: cell.name, teacherId: cell.teacherId || null, isEvent: cell.isEvent || false, eventLabel: cell.eventLabel || null, color: cell.color })));
  });
  return out;
}
function deserializeTimetables(data) {
  const out = {};
  Object.entries(data).forEach(([gid, grid]) => {
    out[gid] = grid.map((day) => day.map((cell) => {
      if (cell.isEvent) return { ...cell };
      return { ...subjectInfo(cell.name), teacherId: cell.teacherId || null, isEvent: false };
    }));
  });
  return out;
}
var _fcfg = { apiKey: "AIzaSyD8EJ86MRlTCarBJEQAWstIf9bddeWFNco", authDomain: "timetable-app-d840a.firebaseapp.com", databaseURL: "https://timetable-app-d840a-default-rtdb.firebaseio.com", projectId: "timetable-app-d840a", storageBucket: "timetable-app-d840a.firebasestorage.app", messagingSenderId: "704283506188", appId: "1:704283506188:web:5cc8a21d96087848cca029" };
var _fapp = initializeApp(_fcfg);
var _db = getDatabase(_fapp);
function _fr(k) {
  return ref(_db, "data/" + k.replace(/[.$#[\]/]/g, "_"));
}
async function storageSave(key, val) {
  try {
    await set(_fr(key), val);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
async function storageGet(key) {
  try {
    const s = await get(_fr(key));
    return s.exists() ? s.val() : null;
  } catch (e) {
    return null;
  }
}
async function saveWeek(w) {
  try {
    await set(ref(_db, "data/weeks/" + w.id), w);
  } catch (e) {
    console.error(e);
  }
}
async function loadAllWeeks() {
  try {
    const s = await get(ref(_db, "data/weeks"));
    if (!s.exists()) return [];
    return Object.values(s.val()).sort((a, b) => a.weekNum - b.weekNum);
  } catch (e) {
    return [];
  }
}
async function deleteWeek(id) {
  try {
    await remove(ref(_db, "data/weeks/" + id));
  } catch (e) {
  }
}
function shadeColor(hex, amt) {
  try {
    let c = parseInt(hex.replace("#", ""), 16);
    return `rgb(${Math.max(0, Math.min(255, (c >> 16 & 255) + amt))},${Math.max(0, Math.min(255, (c >> 8 & 255) + amt))},${Math.max(0, Math.min(255, (c & 255) + amt))})`;
  } catch {
    return "#333";
  }
}
function getWeekDates(startDateStr, weekNum) {
  if (!startDateStr) return null;
  try {
    const base = new Date(startDateStr);
    if (isNaN(base.getTime())) return null;
    const dow = base.getDay();
    const monday = new Date(base);
    monday.setDate(base.getDate() - (dow === 0 ? 6 : dow - 1));
    const weekMonday = new Date(monday);
    weekMonday.setDate(monday.getDate() + (weekNum - 1) * 7);
    const weekFriday = new Date(weekMonday);
    weekFriday.setDate(weekMonday.getDate() + 4);
    const fmt = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
    const fmtFull = (d) => `${d.getFullYear()}\u5E74${d.getMonth() + 1}\u6708${d.getDate()}\u65E5`;
    return {
      monday: weekMonday,
      friday: weekFriday,
      short: `${fmt(weekMonday)}\uFF08\u6708\uFF09\u301C ${fmt(weekFriday)}\uFF08\u91D1\uFF09`,
      full: `${fmtFull(weekMonday)} \u301C ${fmtFull(weekFriday)}`,
      month: weekMonday.getMonth() + 1
    };
  } catch {
    return null;
  }
}
function exportWeekPrint(weekData, teachers, targetGradeId = null) {
  const teacherMap = buildTeacherMap(teachers);
  const timetables = deserializeTimetables(weekData.timetables);
  const weekLabel = weekData.label || `\u7B2C${weekData.weekNum}\u9031`;
  const grades = targetGradeId ? GRADES.filter((g) => g.id === targetGradeId) : GRADES;
  function pastel(hex) {
    try {
      const c = parseInt(hex.replace("#", ""), 16);
      const r = c >> 16 & 255, g = c >> 8 & 255, b = c & 255;
      return `rgb(${r + Math.round((255 - r) * 0.55)},${g + Math.round((255 - g) * 0.55)},${b + Math.round((255 - b) * 0.55)})`;
    } catch {
      return "#f5f5f5";
    }
  }
  function gradeTable(grade) {
    const tt = timetables[grade.id];
    if (!tt) return "";
    const ap = grade.periods;
    let thead = `<tr><th class="period-head"></th>${DAYS.slice(0, grade.days).map((d) => `<th>${d}\u66DC\u65E5</th>`).join("")}</tr>`;
    let tbody = "";
    for (let p = 0; p < ap; p++) {
      let row = `<tr><td class="period-num">${p + 1}</td>`;
      for (let d = 0; d < grade.days; d++) {
        const cell = tt[d]?.[p];
        if (!cell || cell.isEmpty) {
          row += `<td class="empty-cell"></td>`;
        } else if (cell.isEvent) {
          row += `<td class="event-cell">${cell.emoji || ""}${cell.eventLabel || "\u884C\u4E8B"}</td>`;
        } else {
          const t = teachers.find((x) => x.id === teacherMap[`${grade.id}::${cell.name}`]);
          const bg = pastel(cell.color || "#ccc");
          const tc = shadeColor(cell.color || "#ccc", -60);
          row += `<td style="background:${bg};color:${tc}">
            <div class="subject-name">${cell.name}</div>
            ${t ? `<div class="teacher-name">${t.name}</div>` : ""}
          </td>`;
        }
      }
      row += `</tr>`;
      tbody += row;
    }
    return `
      <div class="grade-block">
        <h2 class="grade-title">${grade.label}</h2>
        <table>
          <thead>${thead}</thead>
          <tbody>${tbody}</tbody>
        </table>
      </div>`;
  }
  const tablesHtml = grades.map((g) => gradeTable(g)).join("");
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8"/>
<title>${weekLabel} \u6642\u9593\u5272</title>
<style>
  @page { size: A4 landscape; margin: 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Hiragino Maru Gothic Pro','Yu Gothic','Meiryo',sans-serif; font-size: 11px; }
  .header { text-align: center; margin-bottom: 6mm; }
  .header h1 { font-size: 18px; color: #444; }
  .header p { font-size: 11px; color: #888; margin-top: 2px; }
  .grades-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5mm; }
  .grade-block { break-inside: avoid; }
  .grade-title { font-size: 13px; font-weight: 900; color: #555; margin-bottom: 2mm; padding-bottom: 1mm; border-bottom: 2px solid #eee; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #ddd; text-align: center; padding: 2px 3px; vertical-align: middle; }
  th { background: #f0f0f0; font-size: 10px; font-weight: 700; color: #555; }
  .period-head { width: 14px; }
  .period-num { background: #f8f8f8; color: #aaa; font-weight: 700; font-size: 10px; width: 14px; }
  .subject-name { font-weight: 800; font-size: 11px; }
  .teacher-name { font-size: 9px; color: #777; margin-top: 1px; }
  .empty-cell { background: #fafafa; }
  .event-cell { background: #f5f5f5; color: #aaa; font-size: 10px; }
  /* \u5168\u5B66\u5E74\u306F3\u5217\u3001\u5358\u5B66\u5E74\u306F1\u5217 */
  ${targetGradeId ? ".grades-grid { grid-template-columns: 1fr; max-width: 160mm; margin: 0 auto; }" : ""}
  ${targetGradeId ? ".grade-title { font-size: 16px; }" : ""}
  ${targetGradeId ? "th, td { padding: 4px 6px; }" : ""}
  ${targetGradeId ? ".subject-name { font-size: 13px; } .teacher-name { font-size: 11px; }" : ""}
</style>
</head>
<body>
<div class="header">
  <h1>${weekLabel} \u6642\u9593\u5272</h1>
  ${weekData.note ? `<p>${weekData.note}</p>` : ""}
</div>
<div class="grades-grid">${tablesHtml}</div>
<script>window.onload=function(){ window.print(); window.onafterprint=function(){ window.close(); }; }<\/script>
</body>
</html>`;
  const w = window.open("", "_blank", "width=900,height=700");
  if (w) {
    w.document.write(html);
    w.document.close();
  } else {
    alert("\u30DD\u30C3\u30D7\u30A2\u30C3\u30D7\u304C\u30D6\u30ED\u30C3\u30AF\u3055\u308C\u307E\u3057\u305F\u3002\u30D6\u30E9\u30A6\u30B6\u306E\u30DD\u30C3\u30D7\u30A2\u30C3\u30D7\u8A31\u53EF\u8A2D\u5B9A\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
  }
}
function App() {
  const [view, setView] = useState("week");
  const [teachers, setTeachers] = useState(DEFAULT_TEACHERS);
  const [selectedGrade, setSelectedGrade] = useState(GRADES[0]);
  const [allTimetables, setAllTimetables] = useState(() => generateAllTimetables(DEFAULT_TEACHERS));
  const [animating, setAnimating] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMemo, setPickerMemo] = useState("");
  const [pickerAltTeacher, setPickerAltTeacher] = useState("");
  const [showTeacherPanel, setShowTeacherPanel] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [highlightTeacher, setHighlightTeacher] = useState(null);
  const [showConflictDetail, setShowConflictDetail] = useState(false);
  const [weeks, setWeeks] = useState([]);
  const [currentWeekNum, setCurrentWeekNum] = useState(1);
  const [weekLabel, setWeekLabel] = useState("");
  const [weekNote, setWeekNote] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [storageLoading, setStorageLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [showEventPanel, setShowEventPanel] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [annualHours, setAnnualHours] = useState(ANNUAL_HOURS_DEFAULT);
  const [showHoursPanel, setShowHoursPanel] = useState(false);
  const [hoursGrade, setHoursGrade] = useState(GRADES[0]);
  const [progressGrade, setProgressGrade] = useState(GRADES[0]);
  const [startDate, setStartDate] = useState("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [absences, setAbsences] = useState([]);
  const [showAbsencePanel, setShowAbsencePanel] = useState(false);
  const [baseTimetables, setBaseTimetables] = useState(null);
  const [baseGrade, setBaseGrade] = useState(GRADES[0]);
  const [basePickerCell, setBasePickerCell] = useState(null);
  const [showBasePicker, setShowBasePicker] = useState(false);
  const [periodSettings, setPeriodSettings] = useState(buildDefaultPeriodSettings());
  const [showPeriodPanel, setShowPeriodPanel] = useState(false);
  const [periodGrade, setPeriodGrade] = useState(GRADES[0]);
  useEffect(() => {
    (async () => {
      const savedTeachers = await storageGet("app:teachers");
      if (savedTeachers) {
        setTeachers(savedTeachers);
      }
      const savedHours = await storageGet("app:annualHours");
      if (savedHours) {
        setAnnualHours(savedHours);
      }
      const savedEvents = await storageGet("app:events");
      if (savedEvents) {
        setEvents(savedEvents);
      }
      const savedStartDate = await storageGet("app:startDate");
      if (savedStartDate) {
        setStartDate(savedStartDate);
      }
      const savedAbsences = await storageGet("app:absences");
      if (savedAbsences) {
        setAbsences(savedAbsences);
      }
      const savedBase = await storageGet("app:baseTimetables");
      if (savedBase) {
        setBaseTimetables(savedBase);
      }
      const savedPeriodSettings = await storageGet("app:periodSettings");
      const ps = savedPeriodSettings || buildDefaultPeriodSettings();
      if (savedPeriodSettings) {
        setPeriodSettings(ps);
      }
      const savedWeeks = await loadAllWeeks();
      setWeeks(savedWeeks);
      const t = savedTeachers || DEFAULT_TEACHERS;
      const evs = savedEvents || [];
      const nextWeekNum = savedWeeks.length > 0 ? savedWeeks[savedWeeks.length - 1].weekNum + 1 : 1;
      if (savedWeeks.length > 0) {
        setCurrentWeekNum(nextWeekNum);
        setWeekLabel(`\u7B2C${nextWeekNum}\u9031`);
      }
      if (savedBase) {
        setAllTimetables(applyEventsToBase(savedBase, t, evs, nextWeekNum, ps));
      } else {
        setAllTimetables(generateAllTimetables(t, evs, nextWeekNum, ps));
      }
      setStorageLoading(false);
    })();
  }, []);
  const teacherMap = buildTeacherMap(teachers);
  const conflicts = detectConflicts(allTimetables, teachers);
  const timetable = allTimetables[selectedGrade.id];
  const currentWeekEvents = events.filter((e) => e.weekNum === currentWeekNum);
  const annualProgress = calcAnnualProgress(weeks, annualHours);
  const weekDates = getWeekDates(startDate, currentWeekNum);
  function getAbsence(teacherId, day, period) {
    return absences.find(
      (a) => a.teacherId === teacherId && a.weekNum === currentWeekNum && a.day === day && period >= a.startPeriod && period <= a.endPeriod
    ) || null;
  }
  const currentWeekAbsences = absences.filter((a) => a.weekNum === currentWeekNum);
  async function saveAbsence(ab) {
    let newAbs;
    if (ab.id) {
      newAbs = absences.map((a) => a.id === ab.id ? ab : a);
    } else {
      newAbs = [...absences, { ...ab, id: "ab" + Date.now() }];
    }
    setAbsences(newAbs);
    await storageSave("app:absences", newAbs);
  }
  async function deleteAbsence(id) {
    const newAbs = absences.filter((a) => a.id !== id);
    setAbsences(newAbs);
    await storageSave("app:absences", newAbs);
  }
  function regenerate() {
    setAnimating(true);
    setTimeout(() => {
      if (baseTimetables) {
        setAllTimetables(applyEventsToBase(baseTimetables, teachers, events, currentWeekNum, periodSettings));
      } else {
        setAllTimetables(generateAllTimetables(teachers, events, currentWeekNum, periodSettings));
      }
      setAnimating(false);
    }, 300);
  }
  function regenerateForWeek(wNum) {
    setAnimating(true);
    setTimeout(() => {
      const n = wNum || currentWeekNum;
      if (baseTimetables) {
        setAllTimetables(applyEventsToBase(baseTimetables, teachers, events, n, periodSettings));
      } else {
        setAllTimetables(generateAllTimetables(teachers, events, n, periodSettings));
      }
      setAnimating(false);
    }, 300);
  }
  function handleCellTap(day, period) {
    const cell = allTimetables[selectedGrade.id]?.[day]?.[period];
    if (!cell || cell.isEvent || cell.isEmpty) return;
    setSelected({ day, period });
    setPickerMemo(cell.memo || "");
    setPickerAltTeacher(cell.altTeacher || "");
    setShowPicker(true);
  }
  function handlePickSubject(subjectName) {
    if (!selected) return;
    const { day, period } = selected;
    const si = subjectInfo(subjectName);
    const teacherId = teacherMap[`${selectedGrade.id}::${subjectName}`] || null;
    const newCell = {
      ...si,
      teacherId,
      isEvent: false,
      isEmpty: false,
      memo: pickerMemo.trim() || null,
      altTeacher: pickerAltTeacher.trim() || null
    };
    const newTT = { ...allTimetables };
    const grid = allTimetables[selectedGrade.id].map((d) => [...d]);
    grid[day][period] = newCell;
    newTT[selectedGrade.id] = grid;
    setAllTimetables(newTT);
    setSelected(null);
    setShowPicker(false);
    setPickerMemo("");
    setPickerAltTeacher("");
  }
  function handleSaveMemoOnly() {
    if (!selected) return;
    const { day, period } = selected;
    const cell = allTimetables[selectedGrade.id]?.[day]?.[period];
    if (!cell) return;
    const newCell = { ...cell, memo: pickerMemo.trim() || null, altTeacher: pickerAltTeacher.trim() || null };
    const newTT = { ...allTimetables };
    const grid = allTimetables[selectedGrade.id].map((d) => [...d]);
    grid[day][period] = newCell;
    newTT[selectedGrade.id] = grid;
    setAllTimetables(newTT);
    setSelected(null);
    setShowPicker(false);
    setPickerMemo("");
    setPickerAltTeacher("");
  }
  async function handleSaveWeek() {
    const id = "w" + Date.now();
    const weekData = {
      id,
      weekNum: currentWeekNum,
      label: weekLabel || `\u7B2C${currentWeekNum}\u9031`,
      note: weekNote,
      timetables: serializeTimetables(allTimetables),
      teachers,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await saveWeek(weekData);
    const newWeeks = [...weeks.filter((w) => w.weekNum !== currentWeekNum), weekData].sort((a, b) => a.weekNum - b.weekNum);
    setWeeks(newWeeks);
    setSaveMsg("\u2705 \u4FDD\u5B58\u3057\u307E\u3057\u305F");
    setTimeout(() => setSaveMsg(""), 2500);
  }
  function goNextWeek() {
    const next = currentWeekNum + 1;
    const ex = weeks.find((w) => w.weekNum === next);
    if (ex) {
      setAllTimetables(deserializeTimetables(ex.timetables));
      setWeekLabel(ex.label);
      setWeekNote(ex.note || "");
    } else {
      setWeekLabel(`\u7B2C${next}\u9031`);
      setWeekNote("");
      regenerateForWeek(next);
    }
    setCurrentWeekNum(next);
  }
  function goPrevWeek() {
    const prev = currentWeekNum - 1;
    if (prev < 1) return;
    const ex = weeks.find((w) => w.weekNum === prev);
    if (ex) {
      setAllTimetables(deserializeTimetables(ex.timetables));
      setWeekLabel(ex.label);
      setWeekNote(ex.note || "");
    } else {
      regenerateForWeek(prev);
    }
    setCurrentWeekNum(prev);
  }
  function loadWeek(weekData) {
    setAllTimetables(deserializeTimetables(weekData.timetables));
    setCurrentWeekNum(weekData.weekNum);
    setWeekLabel(weekData.label);
    setWeekNote(weekData.note || "");
    setView("week");
  }
  async function handleDeleteWeek(id, e) {
    e.stopPropagation();
    if (!confirm("\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F")) return;
    await deleteWeek(id);
    setWeeks((prev) => prev.filter((w) => w.id !== id));
  }
  function openNewEvent() {
    setEditingEvent({ id: "", weekNum: currentWeekNum, typeId: "holiday", days: [], gradeIds: [...GRADES.map((g) => g.id)], note: "" });
    setShowEventPanel(true);
  }
  async function saveEvent(ev) {
    let newEvents;
    if (ev.id) {
      newEvents = events.map((e) => e.id === ev.id ? ev : e);
    } else {
      newEvents = [...events, { ...ev, id: "ev" + Date.now() }];
    }
    setEvents(newEvents);
    await storageSave("app:events", newEvents);
    setShowEventPanel(false);
    setEditingEvent(null);
    if (baseTimetables) {
      setAllTimetables(applyEventsToBase(baseTimetables, teachers, newEvents, currentWeekNum, periodSettings));
    } else {
      setAllTimetables(generateAllTimetables(teachers, newEvents, currentWeekNum, periodSettings));
    }
  }
  async function deleteEvent(id) {
    const newEvents = events.filter((e) => e.id !== id);
    setEvents(newEvents);
    await storageSave("app:events", newEvents);
    if (baseTimetables) {
      setAllTimetables(applyEventsToBase(baseTimetables, teachers, newEvents, currentWeekNum, periodSettings));
    } else {
      setAllTimetables(generateAllTimetables(teachers, newEvents, currentWeekNum, periodSettings));
    }
  }
  const TEACHER_COLORS = ["#FF6B6B", "#4ECDC4", "#A29BFE", "#FFB347", "#7BED9F", "#FF9FF3", "#54A0FF", "#FFD93D", "#FFA502", "#74B9FF"];
  function addTeacher() {
    if (!newTeacherName.trim()) return;
    const id = "t" + Date.now();
    const nt = { id, name: newTeacherName.trim(), color: TEACHER_COLORS[teachers.length % 10], assignments: [], jointGroups: [] };
    setTeachers([...teachers, nt]);
    setNewTeacherName("");
    setEditingTeacher(nt);
  }
  function removeTeacher(id) {
    const nt = teachers.filter((t) => t.id !== id);
    setTeachers(nt);
    if (editingTeacher?.id === id) setEditingTeacher(null);
  }
  function toggleAssignment(teacher, gradeId, subject) {
    const assignments = teacher.assignments || [];
    const has = assignments.some((a) => a.gradeId === gradeId && a.subject === subject);
    let na;
    if (has) {
      na = assignments.filter((a) => !(a.gradeId === gradeId && a.subject === subject));
    } else {
      const et = teachers.find((t) => t.id !== teacher.id && (t.assignments || []).some((a) => a.gradeId === gradeId && a.subject === subject));
      if (et) {
        alert(`${et.name}\u304C\u65E2\u306B\u62C5\u5F53\u3057\u3066\u3044\u307E\u3059\u3002`);
        return;
      }
      na = [...assignments, { gradeId, subject }];
    }
    const updated = { ...teacher, assignments: na, jointGroups: teacher.jointGroups || [] };
    const nt = teachers.map((t) => t.id === teacher.id ? updated : t);
    setTeachers(nt);
    setEditingTeacher(updated);
  }
  async function applyTeachers() {
    const normalized = teachers.map((t) => ({ ...t, assignments: t.assignments || [], jointGroups: t.jointGroups || [] }));
    setTeachers(normalized);
    setShowTeacherPanel(false);
    setEditingTeacher(null);
    await storageSave("app:teachers", normalized);
    regenerate();
  }
  function initBaseTimetables() {
    const tt = generateAllTimetables(teachers, [], 1, periodSettings);
    const base = {};
    GRADES.forEach((g) => {
      base[g.id] = tt[g.id].map((day) => day.map((cell) => cell.isEmpty ? "" : cell.name));
    });
    setBaseTimetables(base);
    setAllTimetables(applyEventsToBase(base, teachers, events, currentWeekNum, periodSettings));
  }
  async function saveBaseTimetables() {
    const base = {};
    GRADES.forEach((g) => {
      base[g.id] = allTimetables[g.id].map((day) => day.map((cell) => cell.isEvent || cell.isEmpty ? "" : cell.name));
    });
    setBaseTimetables(base);
    await storageSave("app:baseTimetables", base);
    setSaveMsg("\u2705 \u57FA\u672C\u6642\u9593\u5272\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F");
    setTimeout(() => setSaveMsg(""), 2500);
  }
  async function clearBaseTimetables() {
    if (!confirm("\u57FA\u672C\u6642\u9593\u5272\u3092\u30EA\u30BB\u30C3\u30C8\u3057\u307E\u3059\u304B\uFF1F")) return;
    setBaseTimetables(null);
    await storageSave("app:baseTimetables", null);
    setSaveMsg("\u{1F5D1} \u57FA\u672C\u6642\u9593\u5272\u3092\u30EA\u30BB\u30C3\u30C8\u3057\u307E\u3057\u305F");
    setTimeout(() => setSaveMsg(""), 2500);
  }
  function handleBaseCellTap(gradeId, day, period) {
    if (!baseTimetables) return;
    setBasePickerCell({ gradeId, day, period });
    setShowBasePicker(true);
  }
  function handleBasePickSubject(subjectName) {
    if (!basePickerCell || !baseTimetables) return;
    const { gradeId, day, period } = basePickerCell;
    const base = { ...baseTimetables };
    const grid = base[gradeId].map((d) => [...d]);
    grid[day][period] = subjectName;
    base[gradeId] = grid;
    setBaseTimetables(base);
    setAllTimetables(applyEventsToBase(base, teachers, events, currentWeekNum, periodSettings));
    setBasePickerCell(null);
    setShowBasePicker(false);
  }
  function updatePeriodSetting(gradeId, dayIndex, val) {
    const grade = GRADES.find((g) => g.id === gradeId);
    const maxP = grade?.periods || 6;
    const v = Math.max(0, Math.min(maxP, parseInt(val) || 0));
    const newPS = { ...periodSettings, [gradeId]: [...periodSettings[gradeId]] };
    newPS[gradeId][dayIndex] = v;
    setPeriodSettings(newPS);
  }
  async function savePeriodSettings() {
    await storageSave("app:periodSettings", periodSettings);
    setSaveMsg("\u2705 \u6642\u9650\u6570\u8A2D\u5B9A\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F");
    setTimeout(() => setSaveMsg(""), 2500);
    setShowPeriodPanel(false);
    if (baseTimetables) {
      setAllTimetables(applyEventsToBase(baseTimetables, teachers, events, currentWeekNum, periodSettings));
    } else {
      setAllTimetables(generateAllTimetables(teachers, events, currentWeekNum, periodSettings));
    }
  }
  function updateHour(gradeId, subject, val) {
    const v = Math.max(0, parseInt(val) || 0);
    setAnnualHours((prev) => ({ ...prev, [gradeId]: { ...prev[gradeId], [subject]: v } }));
  }
  async function saveHours() {
    await storageSave("app:annualHours", annualHours);
    setSaveMsg("\u2705 \u6642\u6570\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F");
    setTimeout(() => setSaveMsg(""), 2500);
    setShowHoursPanel(false);
  }
  useEffect(() => {
    if (storageLoading) return;
    const r = ref(_db, "data/weeks");
    return onValue(r, (snap) => {
      if (!snap.exists()) {
        setWeeks([]);
        return;
      }
      setWeeks(Object.values(snap.val()).sort((a, b) => a.weekNum - b.weekNum));
    });
  }, [storageLoading]);
  if (storageLoading) return /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif", color: "#AAA", fontSize: "16px" }, children: "\u{1F4C5} \u8AAD\u307F\u8FBC\u307F\u4E2D..." });
  const conflictCount = conflicts.length;
  return /* @__PURE__ */ jsxs("div", { style: S.root, children: [
    /* @__PURE__ */ jsx("div", { style: S.bgBlob1 }),
    /* @__PURE__ */ jsx("div", { style: S.bgBlob2 }),
    /* @__PURE__ */ jsxs("div", { style: S.container, children: [
      /* @__PURE__ */ jsxs("header", { style: S.header, children: [
        /* @__PURE__ */ jsxs("div", { style: S.headerRow, children: [
          /* @__PURE__ */ jsx("span", { style: S.logo, children: "\u{1F4C5}" }),
          /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsx("h1", { style: S.title, children: "\u3058\u304B\u3093\u308F\u308A \u30E1\u30FC\u30AB\u30FC" }),
            /* @__PURE__ */ jsx("p", { style: S.subtitle, children: "\u9031\u5225\u7BA1\u7406 \u30FB \u884C\u4E8B\u5BFE\u5FDC \u30FB \u5E74\u9593\u6642\u6570\u7BA1\u7406 \u30FB \u5148\u751F\u5272\u308A\u5F53\u3066" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: S.headerBtns, children: [
            /* @__PURE__ */ jsxs("button", { onClick: () => setShowAbsencePanel(true), style: S.iconBtn, children: [
              "\u2708\uFE0F \u51FA\u5F35\u7BA1\u7406",
              currentWeekAbsences.length > 0 && /* @__PURE__ */ jsx("span", { style: { ...S.weekBadge, background: "#e17055" }, children: currentWeekAbsences.length })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => setShowPeriodPanel(true), style: S.iconBtn, children: "\u23F1 \u6642\u9650\u6570\u8A2D\u5B9A" }),
            /* @__PURE__ */ jsx("button", { onClick: () => setShowHoursPanel(true), style: S.iconBtn, children: "\u{1F4CA} \u5E74\u9593\u6642\u6570" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setShowTeacherPanel(true), style: S.iconBtn, children: [
              "\u{1F469}\u200D\u{1F3EB} \u5148\u751F\u7BA1\u7406",
              conflictCount > 0 && /* @__PURE__ */ jsx("span", { style: S.conflictBadge, children: conflictCount })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: S.tabs, children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => setView("base"), style: { ...S.tab, ...view === "base" ? S.tabBase : {} }, children: [
            "\u{1F4CC} \u57FA\u672C\u6642\u9593\u5272",
            baseTimetables && /* @__PURE__ */ jsx("span", { style: { ...S.weekBadge, background: "#27ae60" }, children: "\u2713" })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setView("week"), style: { ...S.tab, ...view === "week" ? S.tabWeek : {} }, children: "\u{1F4C6} \u9031\u7BA1\u7406" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setView("single"), style: { ...S.tab, ...view === "single" ? S.tabActive : {} }, children: "\u{1F4CB} \u5B66\u5E74\u5225" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setView("all"), style: { ...S.tab, ...view === "all" ? S.tabActive : {} }, children: "\u{1F4DA} \u5168\u5B66\u5E74" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setView("progress"), style: { ...S.tab, ...view === "progress" ? S.tabProgress : {} }, children: "\u{1F4C8} \u6642\u6570\u9032\u6357" }),
          /* @__PURE__ */ jsxs("button", { onClick: () => setView("history"), style: { ...S.tab, ...view === "history" ? S.tabHistory : {} }, children: [
            "\u{1F5C2} \u5C65\u6B74",
            weeks.length > 0 && /* @__PURE__ */ jsx("span", { style: S.weekBadge, children: weeks.length })
          ] })
        ] })
      ] }),
      conflictCount > 0 && /* @__PURE__ */ jsxs("div", { style: { ...S.conflictBar, cursor: "pointer" }, onClick: () => setShowConflictDetail(true), children: [
        "\u26A0\uFE0F \u5148\u751F\u306E\u30B3\u30DE\u304C\u91CD\u8907\u3057\u3066\u3044\u307E\u3059\uFF08",
        conflictCount,
        "\u4EF6\uFF09\u2014 ",
        /* @__PURE__ */ jsx("u", { children: "\u30BF\u30C3\u30D7\u3057\u3066\u8A73\u7D30\u3092\u78BA\u8A8D" })
      ] }),
      view === "base" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { style: S.baseBanner, children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { style: S.baseBannerTitle, children: "\u{1F4CC} \u57FA\u672C\u6642\u9593\u5272\u3068\u306F\uFF1F" }),
          /* @__PURE__ */ jsx("p", { style: S.baseBannerDesc, children: "\u6BCE\u9031\u304F\u308A\u8FD4\u3059\u6A19\u6E96\u306E\u6642\u9593\u5272\u3092\u3053\u3053\u3067\u8A2D\u5B9A\u3057\u307E\u3059\u3002\u9031\u7BA1\u7406\u3067\u65B0\u3057\u3044\u9031\u3092\u958B\u304F\u3068\u3001\u3053\u306E\u57FA\u672C\u6642\u9593\u5272\u304C\u81EA\u52D5\u3067\u30B3\u30D4\u30FC\u3055\u308C\u307E\u3059\u3002\u884C\u4E8B\u304C\u3042\u308C\u3070\u305D\u306E\u65E5\u3060\u3051\u81EA\u52D5\u3067\u5909\u66F4\u3055\u308C\u307E\u3059\u3002" })
        ] }) }),
        !baseTimetables ? (
          /* 未設定時 */
          /* @__PURE__ */ jsxs("div", { style: S.baseEmpty, children: [
            /* @__PURE__ */ jsx("p", { style: { fontSize: "48px", margin: "0 0 12px" }, children: "\u{1F4CB}" }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: "16px", fontWeight: 800, color: "#555", margin: "0 0 8px" }, children: "\u57FA\u672C\u6642\u9593\u5272\u304C\u307E\u3060\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093" }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: "13px", color: "#AAA", margin: "0 0 24px" }, children: "\u307E\u305A\u81EA\u52D5\u751F\u6210\u3057\u3066\u3001\u30B3\u30DE\u3092\u4E26\u3079\u66FF\u3048\u3066\u304B\u3089\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044" }),
            /* @__PURE__ */ jsx("button", { onClick: () => {
              initBaseTimetables();
            }, style: S.baseInitBtn, children: "\u{1F500} \u81EA\u52D5\u751F\u6210\u3057\u3066\u59CB\u3081\u308B" })
          ] })
        ) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { style: S.btnRow, children: [
            /* @__PURE__ */ jsx("button", { onClick: initBaseTimetables, style: S.regenBtn, children: "\u{1F500} \u81EA\u52D5\u751F\u6210\u3057\u306A\u304A\u3059" }),
            /* @__PURE__ */ jsx("button", { onClick: saveBaseTimetables, style: S.saveWeekBtn, children: "\u{1F4BE} \u57FA\u672C\u6642\u9593\u5272\u3092\u4FDD\u5B58" }),
            /* @__PURE__ */ jsx("button", { onClick: clearBaseTimetables, style: { ...S.pdfBtn, background: "linear-gradient(135deg,#e17055,#d63031)" }, children: "\u{1F5D1} \u30EA\u30BB\u30C3\u30C8" }),
            saveMsg && /* @__PURE__ */ jsx("span", { style: S.saveMsg, children: saveMsg })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", color: "#AAA", marginBottom: "12px" }, children: "\u30B3\u30DE\u3092\u30BF\u30C3\u30D7\u3057\u3066\u6559\u79D1\u3092\u9078\u629E\u3067\u304D\u307E\u3059\uFF08\u5B66\u5E74\u3054\u3068\uFF09" }),
          /* @__PURE__ */ jsxs("div", { style: S.card, children: [
            /* @__PURE__ */ jsx("p", { style: S.sectionLabel, children: "\u{1F4DA} \u5B66\u5E74\u3092\u9078\u3093\u3067\u7DE8\u96C6" }),
            /* @__PURE__ */ jsx("div", { style: S.gradeGroups, children: ["e", "j"].map((type) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { style: S.groupLabel, children: type === "e" ? "\u5C0F\u5B66\u6821" : "\u4E2D\u5B66\u6821" }),
              /* @__PURE__ */ jsx("div", { style: S.gradeBtns, children: GRADES.filter((g) => g.type === type).map((g) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setBaseGrade(g),
                  style: { ...S.gradeBtn, ...baseGrade.id === g.id ? type === "e" ? S.gradeBtnE : S.gradeBtnJ : {} },
                  children: g.label
                },
                g.id
              )) })
            ] }, type)) })
          ] }),
          /* @__PURE__ */ jsx("div", { style: { ...S.card, padding: "18px", overflowX: "auto" }, children: /* @__PURE__ */ jsx(
            BaseTimetableGrid,
            {
              grade: baseGrade,
              base: baseTimetables[baseGrade.id],
              teachers,
              teacherMap,
              selected: null,
              onCellTap: (d, p) => handleBaseCellTap(baseGrade.id, d, p)
            }
          ) }),
          /* @__PURE__ */ jsx("p", { style: { ...S.sectionLabel, marginTop: "8px" }, children: "\u5168\u5B66\u5E74 \u30D7\u30EC\u30D3\u30E5\u30FC" }),
          /* @__PURE__ */ jsx("div", { style: S.weekPreviewGrid, children: GRADES.map((g) => /* @__PURE__ */ jsxs("div", { style: S.weekPreviewCard, onClick: () => setBaseGrade(g), children: [
            /* @__PURE__ */ jsx("div", { style: S.weekPreviewHeader, children: /* @__PURE__ */ jsx("span", { style: { ...S.weekPreviewLabel, color: g.type === "j" ? "#A29BFE" : "#FF6B6B" }, children: g.label }) }),
            /* @__PURE__ */ jsx(BaseMiniGrid, { grade: g, base: baseTimetables[g.id] })
          ] }, g.id)) })
        ] })
      ] }),
      view === "week" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { style: S.weekNav, children: [
          /* @__PURE__ */ jsx("button", { onClick: goPrevWeek, disabled: currentWeekNum <= 1, style: { ...S.weekNavBtn, opacity: currentWeekNum <= 1 ? 0.3 : 1 }, children: "\u2039 \u524D\u306E\u9031" }),
          /* @__PURE__ */ jsxs("div", { style: S.weekNavCenter, children: [
            /* @__PURE__ */ jsxs("div", { style: S.weekNumBig, children: [
              "\u7B2C ",
              /* @__PURE__ */ jsx("span", { style: S.weekNumAccent, children: currentWeekNum }),
              " \u9031"
            ] }),
            weekDates ? /* @__PURE__ */ jsxs("div", { style: S.weekDateRange, children: [
              "\u{1F4C5} ",
              weekDates.short
            ] }) : /* @__PURE__ */ jsx("button", { onClick: () => setShowStartDatePicker(true), style: S.setDateBtn, children: "\u{1F4C5} \u958B\u59CB\u65E5\u3092\u8A2D\u5B9A" }),
            /* @__PURE__ */ jsxs("div", { style: { marginTop: "4px", display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }, children: [
              weeks.find((w) => w.weekNum === currentWeekNum) ? /* @__PURE__ */ jsx("span", { style: S.savedTag, children: "\u{1F4BE} \u4FDD\u5B58\u6E08\u307F" }) : /* @__PURE__ */ jsx("span", { style: S.unsavedTag, children: "\u672A\u4FDD\u5B58" }),
              weekDates && /* @__PURE__ */ jsx("button", { onClick: () => setShowStartDatePicker(true), style: S.changeDateBtn, children: "\u2699\uFE0F \u958B\u59CB\u65E5\u5909\u66F4" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: goNextWeek, style: { ...S.weekNavBtn, ...S.weekNavBtnNext }, children: "\u6B21\u306E\u9031 \u203A" })
        ] }),
        showStartDatePicker && /* @__PURE__ */ jsxs("div", { style: S.startDateCard, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: 700, color: "#555" }, children: "\u{1F4C5} \u5B66\u5E74\u5EA6\u306E\u958B\u59CB\u65E5\uFF08\u7B2C1\u9031\u306E\u6708\u66DC\u65E5\uFF09" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: startDate,
                onChange: async (e) => {
                  setStartDate(e.target.value);
                  await storageSave("app:startDate", e.target.value);
                },
                style: { ...S.weekInput, width: "160px" }
              }
            ),
            /* @__PURE__ */ jsx("button", { onClick: () => setShowStartDatePicker(false), style: S.closeDateBtn, children: "\u2715 \u9589\u3058\u308B" })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { margin: "8px 0 0", fontSize: "11px", color: "#AAA" }, children: "\u8A2D\u5B9A\u3059\u308B\u3068\u5404\u9031\u306E\u300C\u25CB\u6708\u25CB\u65E5\u301C\u25CB\u65E5\u300D\u304C\u81EA\u52D5\u8A08\u7B97\u3055\u308C\u307E\u3059\u3002\u5909\u66F4\u306F\u81EA\u52D5\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002" })
        ] }),
        /* @__PURE__ */ jsx("div", { style: S.card, children: /* @__PURE__ */ jsxs("div", { style: S.weekInfoRow, children: [
          /* @__PURE__ */ jsxs("div", { style: S.weekInfoField, children: [
            /* @__PURE__ */ jsx("label", { style: S.fieldLabel, children: "\u9031\u306E\u30BF\u30A4\u30C8\u30EB" }),
            /* @__PURE__ */ jsx("input", { value: weekLabel, onChange: (e) => setWeekLabel(e.target.value), placeholder: `\u7B2C${currentWeekNum}\u9031`, style: S.weekInput })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { ...S.weekInfoField, flex: 2 }, children: [
            /* @__PURE__ */ jsx("label", { style: S.fieldLabel, children: "\u30E1\u30E2" }),
            /* @__PURE__ */ jsx("input", { value: weekNote, onChange: (e) => setWeekNote(e.target.value), placeholder: "\u4F8B\uFF1A\u904B\u52D5\u4F1A\u7DF4\u7FD2\u9031\u3001\u30C6\u30B9\u30C8\u9031...", style: S.weekInput })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { style: S.card, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }, children: [
            /* @__PURE__ */ jsx("p", { style: { ...S.sectionLabel, margin: 0 }, children: "\u{1F389} \u3053\u306E\u9031\u306E\u884C\u4E8B" }),
            /* @__PURE__ */ jsx("button", { onClick: openNewEvent, style: S.addEventBtn, children: "\uFF0B \u884C\u4E8B\u3092\u8FFD\u52A0" })
          ] }),
          currentWeekEvents.length === 0 ? /* @__PURE__ */ jsx("p", { style: { color: "#CCC", fontSize: "13px", margin: 0 }, children: "\u884C\u4E8B\u306A\u3057\uFF08\u901A\u5E38\u6388\u696D\u9031\uFF09" }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" }, children: currentWeekEvents.map((ev) => {
            const et = eventTypeInfo(ev.typeId);
            return /* @__PURE__ */ jsxs("div", { style: { ...S.eventChip, background: et.color + "22", borderColor: et.color }, children: [
              /* @__PURE__ */ jsxs("span", { children: [
                et.emoji,
                " ",
                et.label
              ] }),
              /* @__PURE__ */ jsxs("span", { style: { color: "#AAA", fontSize: "11px", marginLeft: "4px" }, children: [
                ev.days.map((d) => ALL_DAYS_LABELS[d]).join("\u30FB"),
                "\u66DC"
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: () => {
                setEditingEvent(ev);
                setShowEventPanel(true);
              }, style: S.eventEditBtn, children: "\u270F\uFE0F" }),
              /* @__PURE__ */ jsx("button", { onClick: () => deleteEvent(ev.id), style: S.eventDeleteBtn, children: "\u2715" })
            ] }, ev.id);
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: S.btnRow, children: [
          /* @__PURE__ */ jsx("button", { onClick: () => regenerateForWeek(), style: S.regenBtn, children: baseTimetables ? "\u{1F4CC} \u57FA\u672C\u6642\u9593\u5272\u304B\u3089\u53CD\u6620" : "\u{1F500} \u81EA\u52D5\u4F5C\u6210" }),
          /* @__PURE__ */ jsx("button", { onClick: handleSaveWeek, style: S.saveWeekBtn, children: "\u{1F4BE} \u3053\u306E\u9031\u3092\u4FDD\u5B58" }),
          /* @__PURE__ */ jsx("button", { onClick: () => exportWeekPrint({ weekNum: currentWeekNum, label: weekLabel || `\u7B2C${currentWeekNum}\u9031`, note: weekNote, timetables: serializeTimetables(allTimetables) }, teachers), style: S.pdfBtn, children: "\u{1F4C4} PDF\u51FA\u529B" }),
          saveMsg && /* @__PURE__ */ jsx("span", { style: S.saveMsg, children: saveMsg })
        ] }),
        /* @__PURE__ */ jsx("div", { style: S.weekPreviewGrid, children: GRADES.map((grade) => /* @__PURE__ */ jsxs("div", { style: S.weekPreviewCard, onClick: () => {
          setSelectedGrade(grade);
          setView("single");
        }, children: [
          /* @__PURE__ */ jsxs("div", { style: S.weekPreviewHeader, children: [
            /* @__PURE__ */ jsx("span", { style: { ...S.weekPreviewLabel, color: grade.type === "j" ? "#A29BFE" : "#FF6B6B" }, children: grade.label }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#CCC" }, children: "\u270F\uFE0F" })
          ] }),
          /* @__PURE__ */ jsx(MiniTimetable, { grade, timetable: allTimetables[grade.id], teachers, teacherMap, conflicts })
        ] }, grade.id)) })
      ] }),
      view === "single" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("section", { style: S.card, children: [
          /* @__PURE__ */ jsx("p", { style: S.sectionLabel, children: "\u{1F4DA} \u5B66\u5E74\u3092\u9078\u307C\u3046" }),
          /* @__PURE__ */ jsx("div", { style: S.gradeGroups, children: ["e", "j"].map((type) => /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: S.groupLabel, children: type === "e" ? "\u5C0F\u5B66\u6821" : "\u4E2D\u5B66\u6821" }),
            /* @__PURE__ */ jsx("div", { style: S.gradeBtns, children: GRADES.filter((g) => g.type === type).map((g) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSelectedGrade(g),
                style: { ...S.gradeBtn, ...selectedGrade.id === g.id ? type === "e" ? S.gradeBtnE : S.gradeBtnJ : {} },
                children: g.label
              },
              g.id
            )) })
          ] }, type)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: S.btnRow, children: [
          /* @__PURE__ */ jsx("button", { onClick: regenerate, style: S.regenBtn, children: "\u{1F500} \u4F5C\u308A\u306A\u304A\u3059" }),
          /* @__PURE__ */ jsxs("button", { onClick: handleSaveWeek, style: S.saveWeekBtn, children: [
            "\u{1F4BE} \u7B2C",
            currentWeekNum,
            "\u9031\u3092\u4FDD\u5B58"
          ] }),
          saveMsg && /* @__PURE__ */ jsx("span", { style: S.saveMsg, children: saveMsg }),
          /* @__PURE__ */ jsx("span", { style: S.hint, children: "\u30B3\u30DE\u3092\u30BF\u30C3\u30D7\u3057\u3066\u6559\u79D1\u3092\u9078\u629E\u3067\u304D\u307E\u3059" })
        ] }),
        teachers.length > 0 && /* @__PURE__ */ jsx("div", { style: S.teacherLegend, children: teachers.map((t) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setHighlightTeacher(highlightTeacher === t.id ? null : t.id),
            style: { ...S.teacherTag, borderColor: t.color, background: highlightTeacher === t.id ? t.color + "33" : "white", boxShadow: highlightTeacher === t.id ? `0 0 0 2px ${t.color}` : void 0 },
            children: [
              /* @__PURE__ */ jsx("span", { style: { ...S.teacherDot, background: t.color } }),
              t.name,
              /* @__PURE__ */ jsxs("span", { style: { fontSize: "10px", color: "#999", marginLeft: "2px" }, children: [
                "(",
                (t.assignments || []).filter((a) => a.gradeId === selectedGrade.id).map((a) => a.subject).join("\u30FB") || "\u62C5\u5F53\u306A\u3057",
                ")"
              ] })
            ]
          },
          t.id
        )) }),
        /* @__PURE__ */ jsx("div", { style: { ...S.card, padding: "18px", opacity: animating ? 0 : 1, transition: "opacity .3s", overflowX: "auto" }, children: /* @__PURE__ */ jsx(
          TimetableGrid,
          {
            grade: selectedGrade,
            timetable,
            teachers,
            teacherMap,
            conflicts,
            highlightTeacher,
            selected,
            onCellTap: handleCellTap,
            getAbsence
          }
        ) })
      ] }),
      view === "all" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { style: S.btnRow, children: [
          /* @__PURE__ */ jsx("button", { onClick: regenerate, style: S.regenBtn, children: "\u{1F500} \u5168\u5B66\u5E74 \u4F5C\u308A\u306A\u304A\u3059" }),
          /* @__PURE__ */ jsxs("button", { onClick: handleSaveWeek, style: S.saveWeekBtn, children: [
            "\u{1F4BE} \u7B2C",
            currentWeekNum,
            "\u9031\u3092\u4FDD\u5B58"
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => exportWeekPrint({ weekNum: currentWeekNum, label: weekLabel || `\u7B2C${currentWeekNum}\u9031`, note: weekNote, timetables: serializeTimetables(allTimetables) }, teachers), style: S.pdfBtn, children: "\u{1F4C4} \u5168\u5B66\u5E74PDF" }),
          saveMsg && /* @__PURE__ */ jsx("span", { style: S.saveMsg, children: saveMsg })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { opacity: animating ? 0 : 1, transition: "opacity .3s" }, children: ["e", "j"].map((type) => /* @__PURE__ */ jsxs("div", { style: S.allSection, children: [
          /* @__PURE__ */ jsxs("h2", { style: { ...S.allSectionTitle, color: type === "e" ? "#FF6B6B" : "#A29BFE" }, children: [
            "\u{1F3EB} ",
            type === "e" ? "\u5C0F\u5B66\u6821" : "\u4E2D\u5B66\u6821"
          ] }),
          /* @__PURE__ */ jsx("div", { style: S.allGrid, children: GRADES.filter((g) => g.type === type).map((grade) => /* @__PURE__ */ jsxs("div", { style: S.allCard, children: [
            /* @__PURE__ */ jsxs("div", { style: S.allCardHeader, children: [
              /* @__PURE__ */ jsx("span", { style: { ...S.allCardTitle, color: grade.type === "j" ? "#A29BFE" : "#FF6B6B" }, children: grade.label }),
              /* @__PURE__ */ jsx("button", { onClick: () => {
                setSelectedGrade(grade);
                setView("single");
              }, style: S.allCardEdit, children: "\u270F\uFE0F \u7DE8\u96C6" })
            ] }),
            /* @__PURE__ */ jsx(MiniTimetable, { grade, timetable: allTimetables[grade.id], teachers, teacherMap, conflicts })
          ] }, grade.id)) })
        ] }, type)) })
      ] }),
      view === "progress" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { style: S.progressHeader, children: [
          /* @__PURE__ */ jsx("h2", { style: S.progressTitle, children: "\u{1F4C8} \u5E74\u9593\u6642\u6570 \u9032\u6357\u72B6\u6CC1" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsxs("span", { style: S.progressMeta, children: [
              "\u96C6\u8A08\u9031\u6570: ",
              /* @__PURE__ */ jsxs("b", { children: [
                weeks.length,
                "\u9031"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { style: S.gradeBtns, children: GRADES.map((g) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setProgressGrade(g),
                style: { ...S.gradeBtn, ...progressGrade.id === g.id ? g.type === "e" ? S.gradeBtnE : S.gradeBtnJ : {}, ...{ padding: "6px 10px", fontSize: "12px" } },
                children: g.label
              },
              g.id
            )) })
          ] })
        ] }),
        weeks.length === 0 ? /* @__PURE__ */ jsxs("div", { style: S.emptyHistory, children: [
          /* @__PURE__ */ jsx("p", { style: { fontSize: "36px" }, children: "\u{1F4ED}" }),
          /* @__PURE__ */ jsx("p", { style: { color: "#AAA" }, children: "\u307E\u3060\u4FDD\u5B58\u6E08\u307F\u306E\u9031\u304C\u3042\u308A\u307E\u305B\u3093" }),
          /* @__PURE__ */ jsx("p", { style: { color: "#CCC", fontSize: "13px" }, children: "\u9031\u3092\u4FDD\u5B58\u3059\u308B\u3068\u6642\u6570\u304C\u81EA\u52D5\u96C6\u8A08\u3055\u308C\u307E\u3059" })
        ] }) : /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { style: S.card, children: [
            /* @__PURE__ */ jsxs("p", { style: S.sectionLabel, children: [
              progressGrade.label,
              " \u2014 \u6559\u79D1\u5225 \u5E74\u9593\u6642\u6570\u9032\u6357"
            ] }),
            /* @__PURE__ */ jsx("div", { style: S.progressGrid, children: Object.entries(annualProgress[progressGrade.id] || {}).map(([subject, { done, target, pct }]) => {
              const si = subjectInfo(subject);
              const color = pct >= 100 ? "#27ae60" : pct >= 70 ? "#f39c12" : "#3498db";
              return /* @__PURE__ */ jsxs("div", { style: S.progressCard, children: [
                /* @__PURE__ */ jsxs("div", { style: S.progressCardTop, children: [
                  /* @__PURE__ */ jsx("span", { style: S.progressEmoji, children: si.emoji }),
                  /* @__PURE__ */ jsx("span", { style: S.progressSubjectName, children: subject }),
                  /* @__PURE__ */ jsxs("span", { style: { ...S.progressPct, color }, children: [
                    pct,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { style: S.progressBarBg, children: /* @__PURE__ */ jsx("div", { style: { ...S.progressBarFill, width: `${pct}%`, background: pct >= 100 ? "linear-gradient(90deg,#27ae60,#2ecc71)" : pct >= 70 ? "linear-gradient(90deg,#f39c12,#f1c40f)" : "linear-gradient(90deg,#3498db,#74b9ff)" } }) }),
                /* @__PURE__ */ jsxs("div", { style: S.progressDetail, children: [
                  done,
                  "\u6642\u9593 / ",
                  target,
                  "\u6642\u9593"
                ] }),
                /* @__PURE__ */ jsxs("div", { style: S.progressRemain, children: [
                  "\u6B8B\u308A ",
                  /* @__PURE__ */ jsx("b", { style: { color: pct >= 100 ? "#27ae60" : "#e74c3c" }, children: Math.max(0, target - done) }),
                  " \u6642\u9593"
                ] })
              ] }, subject);
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: S.card, children: [
            /* @__PURE__ */ jsx("p", { style: S.sectionLabel, children: "\u{1F4CA} \u5168\u5B66\u5E74 \u6559\u79D1\u5225 \u9054\u6210\u7387\u30D2\u30FC\u30C8\u30DE\u30C3\u30D7" }),
            /* @__PURE__ */ jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxs("table", { style: S.heatTable, children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { style: S.heatTh, children: "\u6559\u79D1" }),
                GRADES.map((g) => /* @__PURE__ */ jsx("th", { style: { ...S.heatTh, color: g.type === "j" ? "#A29BFE" : "#FF6B6B" }, children: g.label }, g.id))
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: Array.from(new Set(GRADES.flatMap((g) => Object.keys(annualProgress[g.id] || {})))).map((subject) => {
                const si = subjectInfo(subject);
                return /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsxs("td", { style: S.heatSubject, children: [
                    /* @__PURE__ */ jsx("span", { style: { marginRight: "4px" }, children: si.emoji }),
                    subject
                  ] }),
                  GRADES.map((g) => {
                    const prog = annualProgress[g.id]?.[subject];
                    if (!prog) return /* @__PURE__ */ jsx("td", { style: { ...S.heatCell, background: "#F8F9FA", color: "#DDD" }, children: "\u2014" }, g.id);
                    const pct = prog.pct;
                    const bg = pct >= 100 ? "#27ae6033" : pct >= 70 ? "#f39c1233" : pct >= 40 ? "#3498db22" : "#eee";
                    const fc = pct >= 100 ? "#27ae60" : pct >= 70 ? "#d68910" : pct >= 40 ? "#2980b9" : "#AAA";
                    return /* @__PURE__ */ jsx("td", { style: { ...S.heatCell, background: bg, color: fc, fontWeight: pct > 0 ? "700" : "400" }, children: pct > 0 ? `${pct}%` : "\u2014" }, g.id);
                  })
                ] }, subject);
              }) })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { style: S.heatLegend, children: [
              /* @__PURE__ */ jsx("span", { style: { ...S.heatLegendItem, background: "#27ae6033", color: "#27ae60" }, children: "\u25CF 100%\u9054\u6210" }),
              /* @__PURE__ */ jsx("span", { style: { ...S.heatLegendItem, background: "#f39c1233", color: "#d68910" }, children: "\u25CF 70%\u4EE5\u4E0A" }),
              /* @__PURE__ */ jsx("span", { style: { ...S.heatLegendItem, background: "#3498db22", color: "#2980b9" }, children: "\u25CF 40%\u4EE5\u4E0A" }),
              /* @__PURE__ */ jsx("span", { style: { ...S.heatLegendItem, background: "#eee", color: "#AAA" }, children: "\u25CF 40%\u672A\u6E80" })
            ] })
          ] })
        ] })
      ] }),
      view === "history" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { style: S.historyHeader, children: [
          /* @__PURE__ */ jsx("h2", { style: S.historyTitle, children: "\u{1F5C2} \u4FDD\u5B58\u6E08\u307F\u306E\u9031" }),
          /* @__PURE__ */ jsxs("span", { style: S.historyCount, children: [
            weeks.length,
            "\u4EF6"
          ] })
        ] }),
        weeks.length === 0 ? /* @__PURE__ */ jsxs("div", { style: S.emptyHistory, children: [
          /* @__PURE__ */ jsx("p", { style: { fontSize: "36px" }, children: "\u{1F4ED}" }),
          /* @__PURE__ */ jsx("p", { style: { color: "#AAA" }, children: "\u307E\u3060\u4FDD\u5B58\u3055\u308C\u305F\u9031\u306F\u3042\u308A\u307E\u305B\u3093" })
        ] }) : /* @__PURE__ */ jsx("div", { style: S.historyList, children: weeks.map((week) => {
          const tt = deserializeTimetables(week.timetables);
          const weekEvs = events.filter((e) => e.weekNum === week.weekNum);
          return /* @__PURE__ */ jsxs("div", { style: S.historyCard, children: [
            /* @__PURE__ */ jsxs("div", { style: S.historyCardTop, children: [
              /* @__PURE__ */ jsxs("div", { style: S.historyCardLeft, children: [
                /* @__PURE__ */ jsxs("span", { style: S.historyWeekNum, children: [
                  "\u7B2C",
                  week.weekNum,
                  "\u9031"
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { style: S.historyLabel, children: week.label }),
                  week.note && /* @__PURE__ */ jsxs("p", { style: S.historyNote, children: [
                    "\u{1F4DD} ",
                    week.note
                  ] }),
                  (() => {
                    const wd = getWeekDates(startDate, week.weekNum);
                    return wd ? /* @__PURE__ */ jsxs("p", { style: { ...S.historyNote, color: "#74b9ff" }, children: [
                      "\u{1F4C5} ",
                      wd.short
                    ] }) : null;
                  })(),
                  weekEvs.length > 0 && /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "4px" }, children: weekEvs.map((ev) => {
                    const et = eventTypeInfo(ev.typeId);
                    return /* @__PURE__ */ jsxs("span", { style: { fontSize: "11px", background: et.color + "22", color: et.color, borderRadius: "6px", padding: "1px 7px", border: `1px solid ${et.color}44` }, children: [
                      et.emoji,
                      et.label
                    ] }, ev.id);
                  }) }),
                  /* @__PURE__ */ jsxs("p", { style: S.historyDate, children: [
                    new Date(week.createdAt).toLocaleDateString("ja-JP"),
                    " \u4FDD\u5B58"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: S.historyCardActions, children: [
                /* @__PURE__ */ jsx("button", { onClick: () => loadWeek(week), style: S.historyLoadBtn, children: "\u{1F4C2} \u958B\u304F" }),
                /* @__PURE__ */ jsx("button", { onClick: () => exportWeekPrint(week, week.teachers || teachers), style: S.historyPdfBtn, children: "\u{1F4C4}" }),
                /* @__PURE__ */ jsx("button", { onClick: (e) => handleDeleteWeek(week.id, e), style: S.historyDeleteBtn, children: "\u{1F5D1}" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { style: S.historyPreviewGrid, children: GRADES.map((grade) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { style: { ...S.historyPreviewGrade, color: grade.type === "j" ? "#A29BFE" : "#FF6B6B" }, children: grade.label }),
              /* @__PURE__ */ jsx(MiniTimetable, { grade, timetable: tt[grade.id], teachers: week.teachers || teachers, teacherMap: buildTeacherMap(week.teachers || teachers), conflicts: [] })
            ] }, grade.id)) })
          ] }, week.id);
        }) })
      ] }),
      /* @__PURE__ */ jsx("footer", { style: S.footer, children: "\u5B66\u7FD2\u6307\u5C0E\u8981\u9818\u3092\u3082\u3068\u306B\u3057\u305F\u53C2\u8003\u6642\u9593\u5272\u3067\u3059\u3002\u5B9F\u969B\u306E\u5B66\u6821\u306E\u6642\u9593\u5272\u3068\u306F\u7570\u306A\u308B\u5834\u5408\u304C\u3042\u308A\u307E\u3059\u3002" })
    ] }),
    showEventPanel && editingEvent && /* @__PURE__ */ jsx(EventModal, { event: editingEvent, onSave: saveEvent, onClose: () => {
      setShowEventPanel(false);
      setEditingEvent(null);
    }, currentWeekNum, startDate }),
    showHoursPanel && /* @__PURE__ */ jsx("div", { style: S.overlay, onClick: (e) => {
      if (e.target === e.currentTarget) {
        setShowHoursPanel(false);
      }
    }, children: /* @__PURE__ */ jsxs("div", { style: S.modal, children: [
      /* @__PURE__ */ jsxs("div", { style: S.modalHeader, children: [
        /* @__PURE__ */ jsx("h2", { style: S.modalTitle, children: "\u{1F4CA} \u5E74\u9593\u53D6\u5F97\u6642\u6570\u306E\u8A2D\u5B9A" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowHoursPanel(false), style: S.closeBtn, children: "\u2715" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }, children: [
        /* @__PURE__ */ jsxs("div", { style: { ...S.teacherList, width: "160px" }, children: [
          /* @__PURE__ */ jsx("p", { style: S.panelLabel, children: "\u5B66\u5E74" }),
          GRADES.map((g) => /* @__PURE__ */ jsx(
            "div",
            {
              onClick: () => setHoursGrade(g),
              style: { ...S.teacherRow, ...hoursGrade.id === g.id ? { background: "#F0EEFF", borderColor: "#A29BFE" } : {} },
              children: /* @__PURE__ */ jsx("span", { style: { ...S.teacherRowName, color: g.type === "j" ? "#A29BFE" : "#FF6B6B" }, children: g.label })
            },
            g.id
          ))
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, padding: "20px", overflowY: "auto" }, children: [
          /* @__PURE__ */ jsxs("p", { style: S.panelLabel, children: [
            hoursGrade.label,
            " \u2014 \u6559\u79D1\u5225 \u5E74\u9593\u76EE\u6A19\u6642\u6570"
          ] }),
          /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "12px" }, children: Object.entries(annualHours[hoursGrade.id] || {}).map(([subject, val]) => {
            const si = subjectInfo(subject);
            const prog = annualProgress[hoursGrade.id]?.[subject];
            return /* @__PURE__ */ jsxs("div", { style: { ...S.hoursCard, borderColor: si.color + "66" }, children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontSize: "18px" }, children: si.emoji }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: 800, color: shadeColor(si.color, -40) }, children: subject })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    min: "0",
                    max: "500",
                    value: val,
                    onChange: (e) => updateHour(hoursGrade.id, subject, e.target.value),
                    style: { ...S.hoursInput, borderColor: si.color + "88" }
                  }
                ),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#AAA" }, children: "\u6642\u9593" })
              ] }),
              prog && prog.done > 0 && /* @__PURE__ */ jsxs("div", { style: { marginTop: "6px" }, children: [
                /* @__PURE__ */ jsx("div", { style: S.progressBarBg, children: /* @__PURE__ */ jsx("div", { style: { ...S.progressBarFill, width: `${prog.pct}%`, background: si.color, opacity: 0.7 } }) }),
                /* @__PURE__ */ jsxs("div", { style: { fontSize: "10px", color: "#AAA", marginTop: "2px" }, children: [
                  prog.done,
                  "/",
                  val,
                  "\u6642\u9593 (",
                  prog.pct,
                  "%)"
                ] })
              ] })
            ] }, subject);
          }) }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", color: "#BBB", marginTop: "16px" }, children: "\u203B \u5B66\u7FD2\u6307\u5C0E\u8981\u9818\u306E\u6A19\u6E96\u6642\u6570\u3092\u521D\u671F\u5024\u3068\u3057\u3066\u8A2D\u5B9A\u3057\u3066\u3044\u307E\u3059\u3002\u5B66\u6821\u306E\u5B9F\u60C5\u306B\u5408\u308F\u305B\u3066\u5909\u66F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: S.modalFooter, children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setAnnualHours((prev) => ({ ...prev, [hoursGrade.id]: { ...ANNUAL_HOURS_DEFAULT[hoursGrade.id] } })), style: { ...S.applyBtn, background: "#636e72", fontSize: "13px" }, children: "\u{1F504} \u6A19\u6E96\u5024\u306B\u623B\u3059" }),
        /* @__PURE__ */ jsx("button", { onClick: saveHours, style: S.applyBtn, children: "\u{1F4BE} \u4FDD\u5B58\u3059\u308B" })
      ] })
    ] }) }),
    showPeriodPanel && /* @__PURE__ */ jsx("div", { style: S.overlay, onClick: (e) => {
      if (e.target === e.currentTarget) setShowPeriodPanel(false);
    }, children: /* @__PURE__ */ jsxs("div", { style: { ...S.modal, maxWidth: "680px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: S.modalHeader, children: [
        /* @__PURE__ */ jsx("h2", { style: S.modalTitle, children: "\u23F1 \u5B66\u5E74\xD7\u66DC\u65E5\u3054\u3068\u306E\u6642\u9650\u6570\u8A2D\u5B9A" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowPeriodPanel(false), style: S.closeBtn, children: "\u2715" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "20px" }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", color: "#888", marginBottom: "16px" }, children: "\u66DC\u65E5\u3054\u3068\u306B\u6388\u696D\u30B3\u30DE\u6570\u3092\u8A2D\u5B9A\u3067\u304D\u307E\u3059\u3002\u4F8B\u3048\u3070\u6C34\u66DC\u30924\u6642\u9593\u3001\u91D1\u66DC\u30925\u6642\u9593\u306B\u3059\u308B\u306A\u3069\u30020\u306B\u3059\u308B\u3068\u305D\u306E\u66DC\u65E5\u306F\u5168\u30B3\u30DE\u975E\u8868\u793A\u306B\u306A\u308A\u307E\u3059\u3002" }),
        /* @__PURE__ */ jsx("div", { style: { marginBottom: "16px" }, children: /* @__PURE__ */ jsx("div", { style: S.gradeGroups, children: ["e", "j"].map((type) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { style: S.groupLabel, children: type === "e" ? "\u5C0F\u5B66\u6821" : "\u4E2D\u5B66\u6821" }),
          /* @__PURE__ */ jsx("div", { style: S.gradeBtns, children: GRADES.filter((g) => g.type === type).map((g) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setPeriodGrade(g),
              style: { ...S.gradeBtn, ...periodGrade.id === g.id ? type === "e" ? S.gradeBtnE : S.gradeBtnJ : {} },
              children: g.label
            },
            g.id
          )) })
        ] }, type)) }) }),
        /* @__PURE__ */ jsxs("div", { style: { ...S.card, padding: "20px" }, children: [
          /* @__PURE__ */ jsxs("p", { style: { ...S.sectionLabel, marginBottom: "16px" }, children: [
            periodGrade.label,
            " \u2014 \u66DC\u65E5\u3054\u3068\u306E\u30B3\u30DE\u6570\uFF08\u6700\u5927",
            periodGrade.periods,
            "\u6642\u9650\uFF09"
          ] }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap" }, children: DAYS.map((day, i) => {
            const val = periodSettings[periodGrade.id]?.[i] ?? periodGrade.periods;
            const isReduced = val < periodGrade.periods;
            return /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", minWidth: "70px" }, children: [
              /* @__PURE__ */ jsxs("div", { style: { fontSize: "13px", fontWeight: 700, color: "#666", marginBottom: "8px" }, children: [
                day,
                "\u66DC\u65E5"
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }, children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => updatePeriodSetting(periodGrade.id, i, val + 1),
                    disabled: val >= periodGrade.periods,
                    style: { ...S.periodStepBtn, opacity: val >= periodGrade.periods ? 0.3 : 1 },
                    children: "\u25B2"
                  }
                ),
                /* @__PURE__ */ jsx("div", { style: {
                  ...S.periodValueBox,
                  background: isReduced ? "#FFF3F3" : "#F0FFF4",
                  borderColor: isReduced ? "#FF6B6B" : "#27ae60",
                  color: isReduced ? "#c0392b" : "#27ae60"
                }, children: val }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => updatePeriodSetting(periodGrade.id, i, val - 1),
                    disabled: val <= 0,
                    style: { ...S.periodStepBtn, opacity: val <= 0 ? 0.3 : 1 },
                    children: "\u25BC"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { style: { fontSize: "10px", color: "#AAA", marginTop: "6px" }, children: isReduced ? `${periodGrade.periods - val}\u30B3\u30DE\u7701\u7565` : "\u901A\u5E38" })
            ] }, i);
          }) }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "11px", color: "#BBB", marginTop: "14px" }, children: "\u203B \u5909\u66F4\u306F\u300C\u4FDD\u5B58\u3057\u3066\u53CD\u6620\u300D\u3092\u62BC\u3059\u307E\u3067\u9069\u7528\u3055\u308C\u307E\u305B\u3093" })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { ...S.sectionLabel, margin: "16px 0 10px" }, children: "\u5168\u5B66\u5E74 \u73FE\u5728\u306E\u8A2D\u5B9A" }),
        /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "10px" }, children: GRADES.map((g) => /* @__PURE__ */ jsxs(
          "div",
          {
            style: { ...S.card, padding: "12px", cursor: "pointer", border: periodGrade.id === g.id ? "1.5px solid #A29BFE" : "1.5px solid #F0F0F0" },
            onClick: () => setPeriodGrade(g),
            children: [
              /* @__PURE__ */ jsx("p", { style: { fontSize: "13px", fontWeight: 800, color: g.type === "j" ? "#A29BFE" : "#FF6B6B", marginBottom: "8px" }, children: g.label }),
              /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "4px" }, children: DAYS.map((day, i) => {
                const v = periodSettings[g.id]?.[i] ?? g.periods;
                const reduced = v < g.periods;
                return /* @__PURE__ */ jsxs("div", { style: { flex: 1, textAlign: "center" }, children: [
                  /* @__PURE__ */ jsx("div", { style: { fontSize: "9px", color: "#AAA" }, children: day }),
                  /* @__PURE__ */ jsx("div", { style: {
                    fontSize: "12px",
                    fontWeight: 800,
                    color: reduced ? "#e74c3c" : "#27ae60",
                    background: reduced ? "#FFF3F3" : "#F0FFF4",
                    borderRadius: "4px",
                    padding: "2px 0"
                  }, children: v })
                ] }, i);
              }) })
            ]
          },
          g.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: S.modalFooter, children: [
        /* @__PURE__ */ jsx("button", { onClick: () => {
          setPeriodSettings(buildDefaultPeriodSettings());
          setSaveMsg("");
        }, style: { ...S.applyBtn, background: "#636e72", fontSize: "13px" }, children: "\u{1F504} \u5168\u5B66\u5E74\u30EA\u30BB\u30C3\u30C8" }),
        /* @__PURE__ */ jsx("button", { onClick: savePeriodSettings, style: S.applyBtn, children: "\u{1F4BE} \u4FDD\u5B58\u3057\u3066\u53CD\u6620" })
      ] })
    ] }) }),
    showPicker && selected && /* @__PURE__ */ jsx("div", { style: S.overlay, onClick: (e) => {
      if (e.target === e.currentTarget) {
        setShowPicker(false);
        setSelected(null);
      }
    }, children: /* @__PURE__ */ jsxs("div", { style: { ...S.modal, maxWidth: "420px", maxHeight: "80vh" }, children: [
      /* @__PURE__ */ jsxs("div", { style: S.modalHeader, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { style: S.modalTitle, children: "\u{1F4DA} \u6559\u79D1\u3092\u9078\u629E" }),
          /* @__PURE__ */ jsxs("p", { style: { margin: "2px 0 0", fontSize: "12px", color: "#AAA" }, children: [
            selected.period + 1,
            "\u6642\u9650\u76EE\u30FB",
            DAYS[selected.day],
            "\u66DC\u65E5 \uFF08\u73FE\u5728\uFF1A",
            allTimetables[selectedGrade.id]?.[selected.day]?.[selected.period]?.name,
            "\uFF09"
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          setShowPicker(false);
          setSelected(null);
        }, style: S.closeBtn, children: "\u2715" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { padding: "14px", overflowY: "auto" }, children: [
        (() => {
          const cell = allTimetables[selectedGrade.id]?.[selected.day]?.[selected.period];
          const tid = teacherMap[`${selectedGrade.id}::${cell?.name}`];
          const ab = tid ? getAbsence(tid, selected.day, selected.period) : null;
          if (!ab) return null;
          const t = teachers.find((x) => x.id === ab.teacherId);
          return /* @__PURE__ */ jsxs("div", { style: { background: "#FFF3E0", border: "1.5px solid #e67e22", borderRadius: "10px", padding: "10px 12px", marginBottom: "12px", fontSize: "12px", color: "#e67e22", fontWeight: 700 }, children: [
            "\u2708\uFE0F ",
            t?.name,
            "\u306F\u51FA\u5F35\u4E2D\u3067\u3059",
            ab.note ? `\uFF08${ab.note}\uFF09` : "",
            "\u3002\u4EE3\u66FF\u6559\u54E1\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002"
          ] });
        })(),
        /* @__PURE__ */ jsxs("div", { style: { background: "#F8F9FA", borderRadius: "10px", padding: "12px", marginBottom: "12px" }, children: [
          /* @__PURE__ */ jsx("p", { style: { fontSize: "11px", fontWeight: 700, color: "#888", marginBottom: "8px" }, children: "\u{1F4DD} \u30E1\u30E2\u30FB\u4EE3\u66FF\u8A2D\u5B9A" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "7px" }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "11px", color: "#AAA", display: "block", marginBottom: "3px" }, children: "\u4EE3\u66FF\u6559\u54E1" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  value: pickerAltTeacher,
                  onChange: (e) => setPickerAltTeacher(e.target.value),
                  placeholder: "\u4F8B\uFF1AB\u5148\u751F",
                  style: { ...S.weekInput, fontSize: "13px" }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "11px", color: "#AAA", display: "block", marginBottom: "3px" }, children: "\u30E1\u30E2" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  value: pickerMemo,
                  onChange: (e) => setPickerMemo(e.target.value),
                  placeholder: "\u4F8B\uFF1A\u30C6\u30B9\u30C8\u3001\u81EA\u7FD2\u306A\u3069",
                  style: { ...S.weekInput, fontSize: "13px" }
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleSaveMemoOnly,
                style: { ...S.saveWeekBtn, fontSize: "12px", padding: "7px 14px", alignSelf: "flex-end" },
                children: "\u30E1\u30E2\u3060\u3051\u4FDD\u5B58\uFF08\u6559\u79D1\u5909\u66F4\u306A\u3057\uFF09"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: "11px", fontWeight: 700, color: "#888", marginBottom: "8px" }, children: "\u6559\u79D1\u3092\u5909\u66F4\u3059\u308B\u5834\u5408\u306F\u30BF\u30C3\u30D7" }),
        /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "7px" }, children: getGradeSubjectNames(selectedGrade.id).map((sub) => {
          const si = subjectInfo(sub);
          const isCurrent = allTimetables[selectedGrade.id]?.[selected.day]?.[selected.period]?.name === sub;
          const tid = teacherMap[`${selectedGrade.id}::${sub}`];
          const teacher = teachers.find((t) => t.id === tid);
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handlePickSubject(sub),
              style: {
                padding: "10px 4px",
                borderRadius: "10px",
                border: `2px solid ${isCurrent ? si.color : si.color + "66"}`,
                background: isCurrent ? si.color + "44" : si.color + "18",
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                boxShadow: isCurrent ? `0 0 0 2px ${si.color}` : "none"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { fontSize: "20px" }, children: si.emoji }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", fontWeight: 800, color: shadeColor(si.color, -50) }, children: sub }),
                teacher && /* @__PURE__ */ jsx("span", { style: { fontSize: "9px", color: teacher.color, fontWeight: 700 }, children: teacher.name }),
                isCurrent && /* @__PURE__ */ jsx("span", { style: { fontSize: "9px", color: si.color, fontWeight: 700 }, children: "\u2713 \u73FE\u5728" })
              ]
            },
            sub
          );
        }) })
      ] })
    ] }) }),
    showBasePicker && basePickerCell && /* @__PURE__ */ jsx("div", { style: S.overlay, onClick: (e) => {
      if (e.target === e.currentTarget) {
        setShowBasePicker(false);
        setBasePickerCell(null);
      }
    }, children: /* @__PURE__ */ jsxs("div", { style: { ...S.modal, maxWidth: "420px", maxHeight: "80vh" }, children: [
      /* @__PURE__ */ jsxs("div", { style: S.modalHeader, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { style: S.modalTitle, children: "\u{1F4CC} \u6559\u79D1\u3092\u9078\u629E\uFF08\u57FA\u672C\u6642\u9593\u5272\uFF09" }),
          /* @__PURE__ */ jsxs("p", { style: { margin: "2px 0 0", fontSize: "12px", color: "#AAA" }, children: [
            GRADES.find((g) => g.id === basePickerCell.gradeId)?.label,
            " \uFF0F",
            basePickerCell.period + 1,
            "\u6642\u9650\u76EE\u30FB",
            DAYS[basePickerCell.day],
            "\u66DC\u65E5 \uFF08\u73FE\u5728\uFF1A",
            baseTimetables[basePickerCell.gradeId]?.[basePickerCell.day]?.[basePickerCell.period] || "\u7A7A\u304D",
            "\uFF09"
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          setShowBasePicker(false);
          setBasePickerCell(null);
        }, style: S.closeBtn, children: "\u2715" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { padding: "16px", overflowY: "auto" }, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleBasePickSubject(""),
            style: {
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              border: "1.5px dashed #CCC",
              background: "#F8F9FA",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "13px",
              color: "#AAA",
              marginBottom: "12px"
            },
            children: "\u2015 \u7A7A\u304D\u30B3\u30DE\u306B\u3059\u308B"
          }
        ),
        /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }, children: getGradeSubjectNames(basePickerCell.gradeId).map((sub) => {
          const si = subjectInfo(sub);
          const isCurrent = (baseTimetables[basePickerCell.gradeId]?.[basePickerCell.day]?.[basePickerCell.period] || "") === sub;
          const tid = teacherMap[`${basePickerCell.gradeId}::${sub}`];
          const teacher = teachers.find((t) => t.id === tid);
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleBasePickSubject(sub),
              style: {
                padding: "12px 6px",
                borderRadius: "12px",
                border: `2px solid ${isCurrent ? si.color : si.color + "66"}`,
                background: isCurrent ? si.color + "44" : si.color + "18",
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                boxShadow: isCurrent ? `0 0 0 2px ${si.color}` : "none",
                transition: "all .15s"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { fontSize: "22px" }, children: si.emoji }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: 800, color: shadeColor(si.color, -50) }, children: sub }),
                teacher && /* @__PURE__ */ jsx("span", { style: { fontSize: "9px", color: teacher.color, fontWeight: 700 }, children: teacher.name }),
                isCurrent && /* @__PURE__ */ jsx("span", { style: { fontSize: "9px", color: si.color, fontWeight: 700 }, children: "\u2713 \u73FE\u5728" })
              ]
            },
            sub
          );
        }) })
      ] })
    ] }) }),
    showAbsencePanel && /* @__PURE__ */ jsx(
      AbsenceModal,
      {
        teachers,
        absences,
        currentWeekNum,
        weekDates,
        onSave: saveAbsence,
        onDelete: deleteAbsence,
        onClose: () => setShowAbsencePanel(false)
      }
    ),
    showConflictDetail && /* @__PURE__ */ jsx("div", { style: S.overlay, onClick: (e) => {
      if (e.target === e.currentTarget) setShowConflictDetail(false);
    }, children: /* @__PURE__ */ jsxs("div", { style: { ...S.modal, maxWidth: "520px", maxHeight: "80vh" }, children: [
      /* @__PURE__ */ jsxs("div", { style: S.modalHeader, children: [
        /* @__PURE__ */ jsx("h2", { style: S.modalTitle, children: "\u26A0\uFE0F \u30B3\u30DE\u306E\u91CD\u8907 \u8A73\u7D30" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowConflictDetail(false), style: S.closeBtn, children: "\u2715" })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { padding: "16px", overflowY: "auto" }, children: conflicts.length === 0 ? /* @__PURE__ */ jsx("p", { style: { color: "#27ae60", fontWeight: 700, textAlign: "center", padding: "20px" }, children: "\u2705 \u91CD\u8907\u306F\u3042\u308A\u307E\u305B\u3093" }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: conflicts.map((c, i) => {
        const teacher = teachers.find((t) => t.id === c.teacherId);
        const dayLabel = DAYS[c.day] || "?";
        const periodLabel = `${c.period + 1}\u6642\u9650\u76EE`;
        const weekDateLabel = weekDates ? `\uFF08${weekDates.short}\uFF09` : "";
        return /* @__PURE__ */ jsxs("div", { style: { background: "#FFF5F5", border: "1.5px solid #FF4757", borderRadius: "12px", padding: "14px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }, children: [
            /* @__PURE__ */ jsx("span", { style: { width: "12px", height: "12px", borderRadius: "50%", background: teacher?.color || "#ccc", display: "inline-block", flexShrink: 0 } }),
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 800, fontSize: "14px", color: "#c0392b" }, children: teacher?.name || "\u4E0D\u660E\u306A\u5148\u751F" }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#e74c3c", fontWeight: 700 }, children: "\u304C\u91CD\u8907" })
          ] }),
          /* @__PURE__ */ jsxs("p", { style: { margin: "0 0 8px", fontSize: "13px", color: "#555" }, children: [
            "\u{1F4C5} ",
            dayLabel,
            "\u66DC ",
            periodLabel,
            " ",
            weekDateLabel
          ] }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap" }, children: c.gradeIds.map((gid) => {
            const grade = GRADES.find((g) => g.id === gid);
            const cell = allTimetables[gid]?.[c.day]?.[c.period];
            const si = cell ? subjectInfo(cell.name) : null;
            return /* @__PURE__ */ jsxs("div", { style: { background: "white", border: `1.5px solid ${si?.color || "#ccc"}`, borderRadius: "8px", padding: "6px 10px", fontSize: "12px" }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontWeight: 800, color: grade?.type === "j" ? "#A29BFE" : "#FF6B6B" }, children: grade?.label }),
              /* @__PURE__ */ jsx("span", { style: { margin: "0 4px", color: "#888" }, children: "\u2192" }),
              /* @__PURE__ */ jsxs("span", { style: { fontWeight: 700, color: shadeColor(si?.color || "#ccc", -40) }, children: [
                si?.emoji,
                " ",
                cell?.name
              ] })
            ] }, gid);
          }) }),
          /* @__PURE__ */ jsx("p", { style: { margin: "8px 0 0", fontSize: "11px", color: "#e74c3c" }, children: "\u2192 \u300C\u5148\u751F\u7BA1\u7406\u300D\u3067\u62C5\u5F53\u3092\u5909\u66F4\u3059\u308B\u304B\u3001\u6642\u9593\u5272\u3092\u300C\u4F5C\u308A\u306A\u304A\u3059\u300D\u304B\u3001\u30B3\u30DE\u3092\u30BF\u30C3\u30D7\u3057\u3066\u6559\u79D1\u3092\u5909\u66F4\u3057\u3066\u304F\u3060\u3055\u3044" })
        ] }, i);
      }) }) }),
      /* @__PURE__ */ jsx("div", { style: S.modalFooter, children: /* @__PURE__ */ jsx("button", { onClick: () => {
        setShowConflictDetail(false);
        setShowTeacherPanel(true);
      }, style: S.applyBtn, children: "\u{1F469}\u200D\u{1F3EB} \u5148\u751F\u7BA1\u7406\u3092\u958B\u304F" }) })
    ] }) }),
    showTeacherPanel && /* @__PURE__ */ jsx(
      TeacherModal,
      {
        teachers,
        setTeachers,
        editingTeacher,
        setEditingTeacher,
        newTeacherName,
        setNewTeacherName,
        conflictCount,
        onClose: () => {
          setShowTeacherPanel(false);
          setEditingTeacher(null);
        },
        onApply: applyTeachers,
        addTeacher,
        removeTeacher,
        toggleAssignment
      }
    )
  ] });
}
function EventModal({ event, onSave, onClose, currentWeekNum, startDate }) {
  const [ev, setEv] = useState({
    ...event,
    weekNum: event.weekNum || currentWeekNum,
    gradeIds: event.gradeIds && event.gradeIds.length > 0 ? event.gradeIds : GRADES.map((g) => g.id)
  });
  const et = eventTypeInfo(ev.typeId);
  const hasWeekend = ev.days.some((d) => !isSchoolDay(d));
  const hasSchoolDay = ev.days.some((d) => isSchoolDay(d));
  function toggleDay(d) {
    const ds = ev.days.includes(d) ? ev.days.filter((x) => x !== d) : [...ev.days, d].sort();
    setEv({ ...ev, days: ds });
  }
  function toggleGrade(gid) {
    const gs = (ev.gradeIds || []).includes(gid) ? (ev.gradeIds || []).filter((x) => x !== gid) : [...ev.gradeIds || [], gid];
    setEv({ ...ev, gradeIds: gs });
  }
  function selectAllGrades() {
    setEv({ ...ev, gradeIds: GRADES.map((g) => g.id) });
  }
  function clearGrades() {
    setEv({ ...ev, gradeIds: [] });
  }
  const wd = getWeekDates(startDate, ev.weekNum);
  function dayLabel(i) {
    if (!wd) return ALL_DAYS_LABELS[i];
    const d = new Date(wd.monday);
    d.setDate(d.getDate() + i);
    return `${ALL_DAYS_LABELS[i]}
${d.getMonth() + 1}/${d.getDate()}`;
  }
  return /* @__PURE__ */ jsx("div", { style: S.overlay, onClick: (e) => {
    if (e.target === e.currentTarget) onClose();
  }, children: /* @__PURE__ */ jsxs("div", { style: { ...S.modal, maxWidth: "540px" }, children: [
    /* @__PURE__ */ jsxs("div", { style: S.modalHeader, children: [
      /* @__PURE__ */ jsx("h2", { style: S.modalTitle, children: ev.id ? "\u884C\u4E8B\u3092\u7DE8\u96C6" : "\u884C\u4E8B\u3092\u8FFD\u52A0" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, style: S.closeBtn, children: "\u2715" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { padding: "20px", overflowY: "auto" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { marginBottom: "18px" }, children: [
        /* @__PURE__ */ jsx("label", { style: S.fieldLabel, children: "\u884C\u4E8B\u306E\u7A2E\u985E" }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "8px" }, children: EVENT_TYPES.map((t) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setEv({ ...ev, typeId: t.id }),
            style: {
              padding: "6px 12px",
              borderRadius: "10px",
              border: `2px solid ${t.color}`,
              background: ev.typeId === t.id ? t.color + "33" : "white",
              color: ev.typeId === t.id ? shadeColor(t.color, -40) : "#888",
              fontWeight: ev.typeId === t.id ? "800" : "400",
              cursor: "pointer",
              fontSize: "12px",
              fontFamily: "inherit"
            },
            children: [
              t.emoji,
              " ",
              t.label
            ]
          },
          t.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginBottom: "18px" }, children: [
        /* @__PURE__ */ jsx("label", { style: S.fieldLabel, children: "\u5BFE\u8C61\u306E\u9031" }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px", marginTop: "6px", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              min: "1",
              max: "52",
              value: ev.weekNum,
              onChange: (e) => setEv({ ...ev, weekNum: parseInt(e.target.value) || 1 }),
              style: { ...S.weekInput, width: "70px" }
            }
          ),
          /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", color: "#888" }, children: "\u9031" }),
          wd && /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "#74b9ff", fontWeight: 700 }, children: [
            "\u{1F4C5} ",
            wd.short
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginBottom: "18px" }, children: [
        /* @__PURE__ */ jsx("label", { style: S.fieldLabel, children: "\u5BFE\u8C61\u306E\u66DC\u65E5" }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }, children: ALL_DAYS_LABELS.map((lbl, i) => {
          const isWkend = !isSchoolDay(i);
          const checked = ev.days.includes(i);
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => toggleDay(i),
              style: {
                minWidth: "42px",
                padding: "6px 4px",
                borderRadius: "10px",
                border: `2px solid ${checked ? et.color : isWkend ? "#DFE6E9" : "#E8E8E8"}`,
                background: checked ? et.color + "33" : isWkend ? "#F8F9FA" : "white",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "11px",
                lineHeight: "1.3",
                color: checked ? shadeColor(et.color, -40) : isWkend ? "#b2bec3" : "#AAA",
                fontFamily: "inherit",
                textAlign: "center",
                whiteSpace: "pre-line"
              },
              children: [
                dayLabel(i),
                isWkend && /* @__PURE__ */ jsx("div", { style: { fontSize: "8px", color: checked ? et.color : "#CCC", marginTop: "1px" }, children: "\u8A18\u9332\u306E\u307F" })
              ]
            },
            i
          );
        }) }),
        hasWeekend && !hasSchoolDay && /* @__PURE__ */ jsx("div", { style: S.infoNote, children: "\u{1F4C5} \u571F\u65E5\u306E\u307F\u9078\u629E\u4E2D \u2014 \u6388\u696D\u30B3\u30DE\u306B\u306F\u5F71\u97FF\u3057\u307E\u305B\u3093\uFF08\u884C\u4E8B\u306E\u8A18\u9332\u3068\u3057\u3066\u4FDD\u5B58\u3055\u308C\u307E\u3059\uFF09" }),
        hasWeekend && hasSchoolDay && /* @__PURE__ */ jsx("div", { style: S.infoNote, children: "\u{1F4C5} \u571F\u65E5\u306F\u8A18\u9332\u306E\u307F\u3001\u5E73\u65E5\uFF08\u6708\u301C\u91D1\uFF09\u306F\u9078\u629E\u3057\u305F\u5B66\u5E74\u306E\u6388\u696D\u30B3\u30DE\u304C\u884C\u4E8B\u8868\u793A\u306B\u306A\u308A\u307E\u3059" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginBottom: "18px" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }, children: [
          /* @__PURE__ */ jsx("label", { style: { ...S.fieldLabel, margin: 0 }, children: "\u5BFE\u8C61\u5B66\u5E74" }),
          /* @__PURE__ */ jsx("button", { onClick: selectAllGrades, style: S.gradeQuickBtn, children: "\u5168\u5B66\u5E74" }),
          /* @__PURE__ */ jsx("button", { onClick: clearGrades, style: { ...S.gradeQuickBtn, color: "#e17055", borderColor: "#e17055" }, children: "\u30AF\u30EA\u30A2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: "7px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: S.gradeGroup, children: [
            /* @__PURE__ */ jsx("span", { style: S.gradeGroupLabel, children: "\u5C0F\u5B66\u6821" }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "5px", flexWrap: "wrap" }, children: GRADES.filter((g) => g.type === "e").map((g) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => toggleGrade(g.id),
                style: {
                  ...S.assignChip,
                  background: ev.gradeIds?.includes(g.id) ? "#FEE" : "#F8F9FA",
                  borderColor: ev.gradeIds?.includes(g.id) ? "#FF6B6B" : "#E8E8E8",
                  color: ev.gradeIds?.includes(g.id) ? "#c0392b" : "#888",
                  fontWeight: ev.gradeIds?.includes(g.id) ? "800" : "400"
                },
                children: g.label
              },
              g.id
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: S.gradeGroup, children: [
            /* @__PURE__ */ jsx("span", { style: S.gradeGroupLabel, children: "\u4E2D\u5B66\u6821" }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "5px", flexWrap: "wrap" }, children: GRADES.filter((g) => g.type === "j").map((g) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => toggleGrade(g.id),
                style: {
                  ...S.assignChip,
                  background: ev.gradeIds?.includes(g.id) ? "#EEF" : "#F8F9FA",
                  borderColor: ev.gradeIds?.includes(g.id) ? "#A29BFE" : "#E8E8E8",
                  color: ev.gradeIds?.includes(g.id) ? "#7c6fe0" : "#888",
                  fontWeight: ev.gradeIds?.includes(g.id) ? "800" : "400"
                },
                children: g.label
              },
              g.id
            )) })
          ] })
        ] }),
        ev.gradeIds?.length === 0 && hasSchoolDay && /* @__PURE__ */ jsx("div", { style: { ...S.infoNote, background: "#FFF3F3", borderColor: "#FF4757", color: "#c0392b" }, children: "\u26A0\uFE0F \u5B66\u5E74\u304C\u9078\u629E\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\u5E73\u65E5\u306E\u6388\u696D\u30B3\u30DE\u306B\u5F71\u97FF\u3055\u305B\u308B\u5834\u5408\u306F\u5B66\u5E74\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { style: S.fieldLabel, children: "\u30E1\u30E2" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: ev.note || "",
            onChange: (e) => setEv({ ...ev, note: e.target.value }),
            placeholder: "\u4F8B\uFF1A\u65E5\u66DC\u53C2\u89B3\u306E\u305F\u3081\u6708\u66DC\u632F\u66FF\u4F11\u65E5\uFF08\u5C0F1\u301C\u5C0F3\uFF09",
            style: { ...S.weekInput, marginTop: "6px", width: "100%", boxSizing: "border-box" }
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: S.modalFooter, children: [
      /* @__PURE__ */ jsx("button", { onClick: onClose, style: { ...S.applyBtn, background: "#b2bec3" }, children: "\u30AD\u30E3\u30F3\u30BB\u30EB" }),
      /* @__PURE__ */ jsx("button", { onClick: () => {
        if (ev.days.length === 0) {
          alert("\u66DC\u65E5\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044");
          return;
        }
        onSave(ev);
      }, style: { ...S.applyBtn, background: `linear-gradient(135deg,${et.color},${et.color}BB)` }, children: ev.id ? "\u2705 \u66F4\u65B0" : "\u2705 \u8FFD\u52A0" })
    ] })
  ] }) });
}
function TimetableGrid({ grade, timetable, teachers, teacherMap, conflicts, highlightTeacher, selected, onCellTap, getAbsence }) {
  const safeConflicts = conflicts || [];
  const safeTeacherMap = teacherMap || {};
  return /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: "5px", gridTemplateColumns: `48px repeat(${grade.days},1fr)`, minWidth: "320px" }, children: [
    /* @__PURE__ */ jsx("div", { style: S.cornerCell }),
    DAYS.slice(0, grade.days).map((d) => /* @__PURE__ */ jsxs("div", { style: S.dayHeader, children: [
      d,
      "\u66DC"
    ] }, d)),
    Array.from({ length: grade.periods }, (_, p) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
      /* @__PURE__ */ jsx("div", { style: S.periodLabel, children: p + 1 }),
      Array.from({ length: grade.days }, (_2, d) => {
        const cell = timetable?.[d]?.[p];
        if (!cell || !cell.color) return /* @__PURE__ */ jsx("div", {}, `${d}-${p}`);
        if (cell.isEmpty) return /* @__PURE__ */ jsx("div", { style: { ...S.cell, background: "#F8F9FA", borderColor: "#EEE", borderStyle: "dashed", cursor: "default", justifyContent: "center", opacity: 0.4 }, children: /* @__PURE__ */ jsx("span", { style: { fontSize: "16px", color: "#CCC" }, children: "\u2014" }) }, `${d}-${p}`);
        if (cell.isEvent) return /* @__PURE__ */ jsxs("div", { style: { ...S.cell, background: cell.color + "22", borderColor: cell.color + "66", borderStyle: "dashed", cursor: "default", justifyContent: "center" }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: "18px" }, children: cell.emoji || "\u{1F4CC}" }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", fontWeight: 700, color: cell.color, textAlign: "center" }, children: cell.eventLabel })
        ] }, `${d}-${p}`);
        const tid = safeTeacherMap[`${grade.id}::${cell.name}`];
        const teacher = teachers.find((t) => t.id === tid);
        const isSelected = selected?.day === d && selected?.period === p;
        const isHl = highlightTeacher && tid === highlightTeacher;
        const isConflict = safeConflicts.some((c) => c.teacherId === tid && c.day === d && c.period === p);
        const absence = getAbsence && tid ? getAbsence(tid, d, p) : null;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => onCellTap(d, p),
            style: {
              ...S.cell,
              backgroundColor: isSelected ? cell.color + "88" : cell.color + "33",
              borderColor: isConflict ? "#FF4757" : absence ? "#e67e22" : isSelected ? cell.color : cell.color + "88",
              borderWidth: isSelected || isConflict || absence ? 2 : 1,
              borderStyle: absence ? "dashed" : "solid",
              transform: isSelected ? "scale(0.96)" : "scale(1)",
              boxShadow: isConflict ? "0 0 0 2px #FF4757" : absence ? "0 0 0 2px #e67e22" : isHl ? `0 0 0 3px ${teacher?.color}` : "none",
              opacity: highlightTeacher && !isHl ? 0.35 : 1,
              cursor: "pointer",
              position: "relative"
            },
            children: [
              isSelected && /* @__PURE__ */ jsx("span", { style: S.selectedMark, children: "\u2713" }),
              absence && /* @__PURE__ */ jsx("span", { style: { position: "absolute", top: "2px", left: "3px", fontSize: "10px" }, children: "\u2708\uFE0F" }),
              isConflict && /* @__PURE__ */ jsx("span", { style: S.conflictMark, children: "\u26A0\uFE0F" }),
              /* @__PURE__ */ jsx("span", { style: S.cellEmoji, children: cell.emoji }),
              /* @__PURE__ */ jsx("span", { style: { ...S.cellName, color: shadeColor(cell.color, -50) }, children: cell.name }),
              cell.altTeacher ? /* @__PURE__ */ jsxs("span", { style: { ...S.cellTeacher, background: "#e67e2222", color: "#e67e22", border: "1px solid #e67e2255" }, children: [
                "\u4EE3:",
                cell.altTeacher
              ] }) : teacher && /* @__PURE__ */ jsx("span", { style: { ...S.cellTeacher, background: teacher.color + "22", color: teacher.color, border: `1px solid ${teacher.color}55` }, children: teacher.name }),
              cell.memo && /* @__PURE__ */ jsx("span", { style: { fontSize: "8px", color: "#999", textAlign: "center", lineHeight: 1.2, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "0 2px" }, children: cell.memo })
            ]
          },
          `${d}-${p}`
        );
      })
    ] }, p))
  ] });
}
function AbsenceModal({ teachers, absences, currentWeekNum, weekDates, onSave, onDelete, onClose }) {
  const PERIOD_LABELS = ["1\u6642\u9650\u76EE", "2\u6642\u9650\u76EE", "3\u6642\u9650\u76EE", "4\u6642\u9650\u76EE", "5\u6642\u9650\u76EE", "6\u6642\u9650\u76EE"];
  const SLOT_PRESETS = [
    { label: "\u5348\u524D\uFF081\u301C3\u6642\u9650\uFF09", start: 0, end: 2 },
    { label: "\u5348\u5F8C\uFF084\u301C6\u6642\u9650\uFF09", start: 3, end: 5 },
    { label: "\u7D42\u65E5\uFF081\u301C6\u6642\u9650\uFF09", start: 0, end: 5 }
  ];
  function makeEmpty() {
    return { id: "", teacherId: teachers && teachers[0]?.id || "", weekNum: currentWeekNum, day: 0, startPeriod: 0, endPeriod: 2, note: "" };
  }
  const [form, setForm] = useState(makeEmpty());
  const [editing, setEditing] = useState(false);
  const weekAbsences = (absences || []).filter((a) => a.weekNum === currentWeekNum);
  function startNew() {
    setForm(makeEmpty());
    setEditing(true);
  }
  function startEdit(ab) {
    setForm({ ...ab });
    setEditing(true);
  }
  function cancel() {
    setEditing(false);
    setForm(makeEmpty());
  }
  function save() {
    if (!form.teacherId) {
      alert("\u5148\u751F\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044");
      return;
    }
    if (Number(form.startPeriod) > Number(form.endPeriod)) {
      alert("\u958B\u59CB\u6642\u9650\u306F\u7D42\u4E86\u6642\u9650\u3088\u308A\u524D\u306B\u3057\u3066\u304F\u3060\u3055\u3044");
      return;
    }
    const toSave = { ...form, id: form.id || "ab" + Date.now(), weekNum: Number(form.weekNum), day: Number(form.day), startPeriod: Number(form.startPeriod), endPeriod: Number(form.endPeriod) };
    onSave(toSave);
    setEditing(false);
    setForm(makeEmpty());
  }
  return /* @__PURE__ */ jsx("div", { style: S.overlay, onClick: (e) => {
    if (e.target === e.currentTarget) onClose();
  }, children: /* @__PURE__ */ jsxs("div", { style: { ...S.modal, maxWidth: "500px", maxHeight: "85vh" }, children: [
    /* @__PURE__ */ jsxs("div", { style: S.modalHeader, children: [
      /* @__PURE__ */ jsx("h2", { style: S.modalTitle, children: "\u2708\uFE0F \u51FA\u5F35\u30FB\u4E0D\u5728\u7BA1\u7406" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, style: S.closeBtn, children: "\u2715" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "16px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }, children: [
        /* @__PURE__ */ jsxs("p", { style: S.panelLabel, children: [
          "\u7B2C",
          currentWeekNum,
          "\u9031\u306E\u51FA\u5F35\u30FB\u4E0D\u5728",
          weekDates ? `\uFF08${weekDates.short}\uFF09` : ""
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: startNew, style: S.addBtn, children: "\uFF0B \u8FFD\u52A0" })
      ] }),
      weekAbsences.length === 0 && !editing && /* @__PURE__ */ jsx("p", { style: { color: "#CCC", fontSize: "13px", textAlign: "center", padding: "20px" }, children: "\u3053\u306E\u9031\u306E\u51FA\u5F35\u30FB\u4E0D\u5728\u306F\u3042\u308A\u307E\u305B\u3093" }),
      weekAbsences.map((ab) => {
        const t = (teachers || []).find((x) => x.id === ab.teacherId);
        return /* @__PURE__ */ jsxs("div", { style: { background: "#FFF9F0", border: "1.5px solid #e67e22", borderRadius: "12px", padding: "12px", marginBottom: "8px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }, children: [
            /* @__PURE__ */ jsx("span", { style: { width: "10px", height: "10px", borderRadius: "50%", background: t?.color || "#ccc", display: "inline-block" } }),
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 800, fontSize: "13px" }, children: t?.name || "\u4E0D\u660E" }),
            /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "#888" }, children: [
              DAYS[ab.day],
              "\u66DC\u65E5 ",
              PERIOD_LABELS[ab.startPeriod] || "?",
              "\u301C",
              PERIOD_LABELS[ab.endPeriod] || "?"
            ] })
          ] }),
          ab.note && /* @__PURE__ */ jsx("p", { style: { fontSize: "11px", color: "#888", margin: "0 0 6px" }, children: ab.note }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "6px" }, children: [
            /* @__PURE__ */ jsx("button", { onClick: () => startEdit(ab), style: { ...S.addBtn, fontSize: "11px", padding: "4px 10px" }, children: "\u270F\uFE0F \u7DE8\u96C6" }),
            /* @__PURE__ */ jsx("button", { onClick: () => onDelete(ab.id), style: { padding: "4px 10px", borderRadius: "7px", border: "1.5px solid #FFE0E0", background: "white", color: "#FF4757", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }, children: "\u{1F5D1} \u524A\u9664" })
          ] })
        ] }, ab.id);
      }),
      editing && /* @__PURE__ */ jsxs("div", { style: { background: "#F8F9FA", borderRadius: "14px", padding: "16px", marginTop: "12px", border: "1.5px solid #E8E8E8" }, children: [
        /* @__PURE__ */ jsx("p", { style: { ...S.panelLabel, marginBottom: "12px" }, children: form.id ? "\u51FA\u5F35\u3092\u7DE8\u96C6" : "\u51FA\u5F35\u3092\u8FFD\u52A0" }),
        /* @__PURE__ */ jsxs("div", { style: { marginBottom: "12px" }, children: [
          /* @__PURE__ */ jsx("label", { style: S.fieldLabel, children: "\u5148\u751F" }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }, children: (teachers || []).map((t) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setForm((prev) => ({ ...prev, teacherId: t.id })),
              style: { padding: "6px 12px", borderRadius: "9px", border: `2px solid ${form.teacherId === t.id ? t.color : "#E8E8E8"}`, background: form.teacherId === t.id ? t.color + "33" : "white", color: form.teacherId === t.id ? shadeColor(t.color, -40) : "#888", fontWeight: form.teacherId === t.id ? "800" : "400", cursor: "pointer", fontFamily: "inherit", fontSize: "13px" },
              children: t.name
            },
            t.id
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { marginBottom: "12px", display: "flex", gap: "12px", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: S.fieldLabel, children: "\u9031" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: "1",
                max: "52",
                value: form.weekNum,
                onChange: (e) => setForm((prev) => ({ ...prev, weekNum: parseInt(e.target.value) || 1 })),
                style: { ...S.weekInput, width: "60px", marginTop: "4px" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: S.fieldLabel, children: "\u66DC\u65E5" }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "5px", marginTop: "6px" }, children: DAYS.map((d, i) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setForm((prev) => ({ ...prev, day: i })),
                style: { width: "36px", height: "36px", borderRadius: "8px", border: `2px solid ${form.day === i ? "#667eea" : "#E8E8E8"}`, background: form.day === i ? "#667eea33" : "white", fontWeight: 700, cursor: "pointer", fontSize: "13px", color: form.day === i ? "#667eea" : "#AAA", fontFamily: "inherit" },
                children: d
              },
              i
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { marginBottom: "12px" }, children: [
          /* @__PURE__ */ jsx("label", { style: S.fieldLabel, children: "\u4E0D\u5728\u6642\u9593\u5E2F" }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }, children: SLOT_PRESETS.map((p, i) => {
            const active = Number(form.startPeriod) === p.start && Number(form.endPeriod) === p.end;
            return /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setForm((prev) => ({ ...prev, startPeriod: p.start, endPeriod: p.end })),
                style: { padding: "7px 13px", borderRadius: "9px", border: `2px solid ${active ? "#e67e22" : "#E8E8E8"}`, background: active ? "#e67e2222" : "white", color: active ? "#e67e22" : "#888", fontWeight: active ? "800" : "400", cursor: "pointer", fontFamily: "inherit", fontSize: "12px" },
                children: p.label
              },
              i
            );
          }) }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", alignItems: "center", marginTop: "8px", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#888" }, children: "\u8A73\u7D30\uFF1A" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: form.startPeriod,
                onChange: (e) => setForm((prev) => ({ ...prev, startPeriod: parseInt(e.target.value) })),
                style: { padding: "5px 8px", borderRadius: "7px", border: "1.5px solid #E8E8E8", fontFamily: "inherit", fontSize: "12px" },
                children: PERIOD_LABELS.map((l, i) => /* @__PURE__ */ jsx("option", { value: i, children: l }, i))
              }
            ),
            /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#888" }, children: "\u301C" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: form.endPeriod,
                onChange: (e) => setForm((prev) => ({ ...prev, endPeriod: parseInt(e.target.value) })),
                style: { padding: "5px 8px", borderRadius: "7px", border: "1.5px solid #E8E8E8", fontFamily: "inherit", fontSize: "12px" },
                children: PERIOD_LABELS.map((l, i) => /* @__PURE__ */ jsx("option", { value: i, children: l }, i))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { marginBottom: "14px" }, children: [
          /* @__PURE__ */ jsx("label", { style: S.fieldLabel, children: "\u30E1\u30E2\uFF08\u51FA\u5F35\u5148\u30FB\u7406\u7531\u306A\u3069\uFF09" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: form.note,
              onChange: (e) => setForm((prev) => ({ ...prev, note: e.target.value })),
              placeholder: "\u4F8B\uFF1A\u5E02\u5185\u7814\u4FEE\u3001\u51FA\u5F35\u306A\u3069",
              style: { ...S.weekInput, marginTop: "4px" }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", justifyContent: "flex-end" }, children: [
          /* @__PURE__ */ jsx("button", { onClick: cancel, style: { ...S.applyBtn, background: "#b2bec3", fontSize: "12px", padding: "8px 16px" }, children: "\u30AD\u30E3\u30F3\u30BB\u30EB" }),
          /* @__PURE__ */ jsx("button", { onClick: save, style: { ...S.applyBtn, background: "linear-gradient(135deg,#e67e22,#f39c12)", fontSize: "12px", padding: "8px 16px" }, children: "\u2705 \u4FDD\u5B58" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: S.modalFooter, children: /* @__PURE__ */ jsx("button", { onClick: onClose, style: { ...S.applyBtn, background: "#636e72" }, children: "\u9589\u3058\u308B" }) })
  ] }) });
}
function TeacherModal({ teachers, setTeachers, editingTeacher, setEditingTeacher, newTeacherName, setNewTeacherName, conflictCount, onClose, onApply, addTeacher, removeTeacher, toggleAssignment }) {
  function addJointGroup() {
    if (!editingTeacher) return;
    const jg = [...editingTeacher.jointGroups || [], { gradeIds: [], subject: "\u4F53\u80B2", label: "" }];
    const updated = { ...editingTeacher, jointGroups: jg };
    setTeachers(teachers.map((t) => t.id === editingTeacher.id ? updated : t));
    setEditingTeacher(updated);
  }
  function removeJointGroup(ji) {
    if (!editingTeacher) return;
    const jg = (editingTeacher.jointGroups || []).filter((_, i) => i !== ji);
    const updated = { ...editingTeacher, jointGroups: jg };
    setTeachers(teachers.map((t) => t.id === editingTeacher.id ? updated : t));
    setEditingTeacher(updated);
  }
  function updateJointGroup(ji, patch) {
    if (!editingTeacher) return;
    const jgs = [...editingTeacher.jointGroups || []];
    jgs[ji] = { ...jgs[ji], ...patch };
    const updated = { ...editingTeacher, jointGroups: jgs };
    setTeachers(teachers.map((t) => t.id === editingTeacher.id ? updated : t));
    setEditingTeacher(updated);
  }
  function toggleJointGrade(ji, gid) {
    if (!editingTeacher) return;
    const jg = (editingTeacher.jointGroups || [])[ji];
    if (!jg) return;
    const ids = (jg.gradeIds || []).includes(gid) ? (jg.gradeIds || []).filter((x) => x !== gid) : [...jg.gradeIds || [], gid];
    updateJointGroup(ji, { gradeIds: ids });
  }
  return /* @__PURE__ */ jsx("div", { style: S.overlay, onClick: (e) => {
    if (e.target === e.currentTarget) onClose();
  }, children: /* @__PURE__ */ jsxs("div", { style: S.modal, children: [
    /* @__PURE__ */ jsxs("div", { style: S.modalHeader, children: [
      /* @__PURE__ */ jsx("h2", { style: S.modalTitle, children: "\u{1F469}\u200D\u{1F3EB} \u5148\u751F\u306E\u7BA1\u7406" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, style: S.closeBtn, children: "\u2715" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: S.modalBody, children: [
      /* @__PURE__ */ jsxs("div", { style: S.teacherList, children: [
        /* @__PURE__ */ jsx("p", { style: S.panelLabel, children: "\u5148\u751F\u4E00\u89A7" }),
        (teachers || []).map((t) => /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => setEditingTeacher(t),
            style: { ...S.teacherRow, ...editingTeacher?.id === t.id ? { background: t.color + "22", borderColor: t.color } : {} },
            children: [
              /* @__PURE__ */ jsx("span", { style: { ...S.teacherDot, background: t.color || "#ccc", width: "12px", height: "12px" } }),
              /* @__PURE__ */ jsx("span", { style: S.teacherRowName, children: t.name || "\uFF08\u540D\u524D\u306A\u3057\uFF09" }),
              /* @__PURE__ */ jsx("span", { style: S.teacherRowCount, children: (t.assignments || []).length }),
              /* @__PURE__ */ jsx("button", { onClick: (e) => {
                e.stopPropagation();
                removeTeacher(t.id);
              }, style: S.removeBtn, children: "\u2715" })
            ]
          },
          t.id
        )),
        /* @__PURE__ */ jsxs("div", { style: S.addTeacherRow, children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              value: newTeacherName,
              onChange: (e) => setNewTeacherName(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && addTeacher(),
              placeholder: "\u65B0\u3057\u3044\u5148\u751F\u306E\u540D\u524D",
              style: S.addInput
            }
          ),
          /* @__PURE__ */ jsx("button", { onClick: addTeacher, style: S.addBtn, children: "\u8FFD\u52A0" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: S.assignPanel, children: [
        !editingTeacher && /* @__PURE__ */ jsx("div", { style: S.assignPlaceholder, children: "\u2190 \u5148\u751F\u3092\u9078\u3093\u3067\u62C5\u5F53\u6559\u79D1\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044" }),
        editingTeacher && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { style: S.panelLabel, children: [
            /* @__PURE__ */ jsx("span", { style: { ...S.teacherDot, background: editingTeacher.color || "#ccc", display: "inline-block", marginRight: "6px" } }),
            editingTeacher.name,
            " \u306E\u62C5\u5F53\u6559\u79D1"
          ] }),
          /* @__PURE__ */ jsx("div", { style: S.assignScroll, children: GRADES.map((grade) => {
            const subNames = getGradeSubjectNames(grade.id);
            return /* @__PURE__ */ jsxs("div", { style: S.assignGradeBlock, children: [
              /* @__PURE__ */ jsx("p", { style: { ...S.assignGradeLabel, color: grade.type === "j" ? "#A29BFE" : "#FF6B6B" }, children: grade.label }),
              /* @__PURE__ */ jsx("div", { style: S.assignSubjects, children: subNames.map((sub) => {
                const has = (editingTeacher.assignments || []).some((a) => a.gradeId === grade.id && a.subject === sub);
                const isJoint = (editingTeacher.jointGroups || []).some((jg) => (jg.gradeIds || []).includes(grade.id) && jg.subject === sub);
                const otherT = (teachers || []).find((t) => t.id !== editingTeacher.id && ((t.assignments || []).some((a) => a.gradeId === grade.id && a.subject === sub) || (t.jointGroups || []).some((jg) => (jg.gradeIds || []).includes(grade.id) && jg.subject === sub)));
                const si = subjectInfo(sub) || { color: "#ccc" };
                return /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => toggleAssignment(editingTeacher, grade.id, sub),
                    style: {
                      ...S.assignChip,
                      background: has ? si.color + "33" : isJoint ? si.color + "22" : otherT ? otherT.color + "15" : "#F8F9FA",
                      borderColor: has ? si.color : isJoint ? si.color + "88" : otherT ? otherT.color + "66" : "#E8E8E8",
                      color: has ? shadeColor(si.color, -60) : "#888",
                      fontWeight: has || isJoint ? "800" : "400"
                    },
                    children: [
                      sub,
                      has && /* @__PURE__ */ jsx("span", { style: { fontSize: "9px", marginLeft: "3px" }, children: "(\u62C5\u5F53)" }),
                      isJoint && !has && /* @__PURE__ */ jsx("span", { style: { fontSize: "9px", marginLeft: "3px" }, children: "(\u5408\u540C)" }),
                      otherT && !has && !isJoint && /* @__PURE__ */ jsxs("span", { style: { fontSize: "9px", color: otherT.color, marginLeft: "3px" }, children: [
                        "(",
                        otherT.name,
                        ")"
                      ] })
                    ]
                  },
                  sub
                );
              }) })
            ] }, grade.id);
          }) }),
          /* @__PURE__ */ jsxs("div", { style: { marginTop: "16px", paddingTop: "14px", borderTop: "1.5px solid #F0F0F0" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }, children: [
              /* @__PURE__ */ jsx("p", { style: { ...S.panelLabel, margin: 0 }, children: "\u{1F91D} \u5408\u540C\u6388\u696D\u30B0\u30EB\u30FC\u30D7" }),
              /* @__PURE__ */ jsx("button", { onClick: addJointGroup, style: S.addBtn, children: "\uFF0B \u8FFD\u52A0" })
            ] }),
            (editingTeacher.jointGroups || []).length === 0 && /* @__PURE__ */ jsx("p", { style: { fontSize: "11px", color: "#CCC", margin: 0 }, children: "\u8907\u6570\u5B66\u5E74\u3092\u540C\u3058\u6642\u9593\u306B\u6559\u3048\u308B\u5834\u5408\u306B\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044" }),
            (editingTeacher.jointGroups || []).map((jg, ji) => /* @__PURE__ */ jsxs("div", { style: { background: "#F8F9FA", borderRadius: "10px", padding: "10px", marginBottom: "8px", border: "1.5px solid #EEE" }, children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "6px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" }, children: [
                /* @__PURE__ */ jsx(
                  "select",
                  {
                    value: jg.subject || "\u4F53\u80B2",
                    onChange: (e) => updateJointGroup(ji, { subject: e.target.value }),
                    style: { padding: "4px 8px", borderRadius: "6px", border: "1.5px solid #E8E8E8", fontSize: "12px", fontFamily: "inherit" },
                    children: ["\u4F53\u80B2", "\u97F3\u697D", "\u56F3\u5DE5", "\u7F8E\u8853", "\u5916\u56FD\u8A9E", "\u82F1\u8A9E", "\u9053\u5FB3", "\u5B66\u6D3B", "\u7DCF\u5408"].map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s }, s))
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    placeholder: "\u30B0\u30EB\u30FC\u30D7\u540D\uFF08\u4F8B\uFF1A3\u30FB4\u5E74\u5408\u540C\u4F53\u80B2\uFF09",
                    value: jg.label || "",
                    onChange: (e) => updateJointGroup(ji, { label: e.target.value }),
                    style: { ...S.addInput, flex: 1, minWidth: "120px" }
                  }
                ),
                /* @__PURE__ */ jsx("button", { onClick: () => removeJointGroup(ji), style: { background: "none", border: "none", cursor: "pointer", color: "#e74c3c", fontSize: "16px", padding: "0 4px" }, children: "\u2715" })
              ] }),
              /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "5px", flexWrap: "wrap" }, children: GRADES.map((g) => {
                const inGroup = (jg.gradeIds || []).includes(g.id);
                return /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => toggleJointGrade(ji, g.id),
                    style: {
                      padding: "4px 8px",
                      borderRadius: "7px",
                      border: "1.5px solid",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      background: inGroup ? g.type === "j" ? "#EEF" : "#FEE" : "#F8F9FA",
                      borderColor: inGroup ? g.type === "j" ? "#A29BFE" : "#FF6B6B" : "#E8E8E8",
                      color: inGroup ? g.type === "j" ? "#7c6fe0" : "#c0392b" : "#888",
                      fontWeight: inGroup ? "800" : "400"
                    },
                    children: g.label
                  },
                  g.id
                );
              }) })
            ] }, ji))
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: S.modalFooter, children: [
      conflictCount > 0 && /* @__PURE__ */ jsxs("span", { style: S.conflictNote, children: [
        "\u26A0\uFE0F ",
        conflictCount,
        "\u4EF6\u306E\u91CD\u8907\u3042\u308A"
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onApply, style: S.applyBtn, children: "\u2705 \u8A2D\u5B9A\u3092\u9069\u7528\u3057\u3066\u81EA\u52D5\u4F5C\u6210" })
    ] })
  ] }) });
}
function MiniTimetable({ grade, timetable, teachers, teacherMap, conflicts }) {
  if (!timetable || !Array.isArray(timetable)) return /* @__PURE__ */ jsx("div", { style: { color: "#CCC", fontSize: "11px", padding: "4px" }, children: "\u30C7\u30FC\u30BF\u306A\u3057" });
  const safeConflicts = conflicts || [];
  const safeTeacherMap = teacherMap || {};
  return /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: "2px", gridTemplateColumns: `20px repeat(${grade.days},1fr)` }, children: [
    /* @__PURE__ */ jsx("div", {}),
    DAYS.slice(0, grade.days).map((d) => /* @__PURE__ */ jsx("div", { style: S.miniDayHeader, children: d }, d)),
    Array.from({ length: grade.periods }, (_, p) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
      /* @__PURE__ */ jsx("div", { style: S.miniPeriodLabel, children: p + 1 }),
      Array.from({ length: grade.days }, (_2, d) => {
        const cell = timetable[d]?.[p];
        if (!cell || !cell.color) return /* @__PURE__ */ jsx("div", {}, `${d}-${p}`);
        if (cell.isEmpty) return /* @__PURE__ */ jsx("div", { style: { ...S.miniCell, background: "#F8F9FA", borderColor: "#EEE", borderStyle: "dashed", opacity: 0.3 } }, `${d}-${p}`);
        if (cell.isEvent) return /* @__PURE__ */ jsx("div", { style: { ...S.miniCell, background: cell.color + "33", borderColor: cell.color + "66", borderStyle: "dashed" }, children: /* @__PURE__ */ jsx("span", { style: { fontSize: "8px" }, children: cell.emoji || "\u{1F4CC}" }) }, `${d}-${p}`);
        const tid = safeTeacherMap[`${grade.id}::${cell.name}`];
        const isConflict = safeConflicts.some((c) => c.teacherId === tid && c.day === d && c.period === p);
        return /* @__PURE__ */ jsx("div", { style: { ...S.miniCell, backgroundColor: cell.color + "44", borderColor: isConflict ? "#FF4757" : cell.color + "77" }, children: /* @__PURE__ */ jsx("span", { style: { ...S.miniCellName, color: shadeColor(cell.color, -60) }, children: cell.name }) }, `${d}-${p}`);
      })
    ] }, p))
  ] });
}
function BaseTimetableGrid({ grade, base, teachers, teacherMap, selected, onCellTap }) {
  if (!base) return null;
  return /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: "5px", gridTemplateColumns: `48px repeat(${grade.days},1fr)`, minWidth: "320px" }, children: [
    /* @__PURE__ */ jsx("div", { style: S.cornerCell }),
    DAYS.slice(0, grade.days).map((d) => /* @__PURE__ */ jsxs("div", { style: S.dayHeader, children: [
      d,
      "\u66DC"
    ] }, d)),
    Array.from({ length: grade.periods }, (_, p) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
      /* @__PURE__ */ jsx("div", { style: S.periodLabel, children: p + 1 }, `lbl${p}`),
      Array.from({ length: grade.days }, (_2, d) => {
        const name = base[d]?.[p];
        if (name === "" || name === void 0) {
          return /* @__PURE__ */ jsx("div", { style: { ...S.cell, background: "#F8F9FA", borderColor: "#EEE", borderStyle: "dashed", cursor: "default", opacity: 0.3, justifyContent: "center" }, children: /* @__PURE__ */ jsx("span", { style: { color: "#CCC" }, children: "\u2014" }) }, `${d}-${p}`);
        }
        const si = subjectInfo(name);
        const tid = teacherMap[`${grade.id}::${name}`];
        const teacher = teachers.find((t) => t.id === tid);
        const isSel = selected?.day === d && selected?.period === p;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => onCellTap(d, p),
            style: {
              ...S.cell,
              backgroundColor: si.color + (isSel ? "88" : "33"),
              borderColor: isSel ? si.color : si.color + "88",
              borderWidth: isSel ? 2 : 1,
              transform: isSel ? "scale(0.96)" : "scale(1)",
              boxShadow: isSel ? `0 0 0 3px ${si.color}` : "none",
              cursor: "pointer",
              transition: "all .15s"
            },
            children: [
              isSel && /* @__PURE__ */ jsx("span", { style: S.selectedMark, children: "\u2713" }),
              /* @__PURE__ */ jsx("span", { style: S.cellEmoji, children: si.emoji }),
              /* @__PURE__ */ jsx("span", { style: { ...S.cellName, color: shadeColor(si.color, -50) }, children: name }),
              teacher && /* @__PURE__ */ jsx("span", { style: { ...S.cellTeacher, background: teacher.color + "22", color: teacher.color, border: `1px solid ${teacher.color}55` }, children: teacher.name })
            ]
          },
          `${d}-${p}`
        );
      })
    ] }, p))
  ] });
}
function BaseMiniGrid({ grade, base }) {
  if (!base) return null;
  return /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: "2px", gridTemplateColumns: `20px repeat(${grade.days},1fr)` }, children: [
    /* @__PURE__ */ jsx("div", {}),
    DAYS.slice(0, grade.days).map((d) => /* @__PURE__ */ jsx("div", { style: S.miniDayHeader, children: d }, d)),
    Array.from({ length: grade.periods }, (_, p) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
      /* @__PURE__ */ jsx("div", { style: S.miniPeriodLabel, children: p + 1 }, `ml${p}`),
      Array.from({ length: grade.days }, (_2, d) => {
        const name = base[d]?.[p] || "\u56FD\u8A9E";
        const si = subjectInfo(name);
        return /* @__PURE__ */ jsx("div", { style: { ...S.miniCell, backgroundColor: si.color + "44", borderColor: si.color + "77" }, children: /* @__PURE__ */ jsx("span", { style: { ...S.miniCellName, color: shadeColor(si.color, -60) }, children: name }) }, `${d}-${p}`);
      })
    ] }, p))
  ] });
}
var S = {
  root: { minHeight: "100vh", background: "linear-gradient(135deg,#FFF9F0,#F0F4FF 50%,#F5FFF5)", fontFamily: "'Hiragino Maru Gothic Pro','Yu Gothic',sans-serif", position: "relative", overflow: "hidden" },
  bgBlob1: { position: "fixed", top: "-120px", right: "-120px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle,#FFD93D22,transparent 70%)", pointerEvents: "none" },
  bgBlob2: { position: "fixed", bottom: "-100px", left: "-100px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle,#A29BFE22,transparent 70%)", pointerEvents: "none" },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "20px 14px 48px", position: "relative", zIndex: 1 },
  header: { marginBottom: "18px" },
  headerRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", flexWrap: "wrap" },
  logo: { fontSize: "42px", lineHeight: 1 },
  title: { margin: 0, fontSize: "clamp(18px,4vw,30px)", fontWeight: 900, background: "linear-gradient(90deg,#FF6B6B,#A29BFE,#4ECDC4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subtitle: { margin: "3px 0 0", fontSize: "11px", color: "#888" },
  headerBtns: { display: "flex", gap: "8px", flexWrap: "wrap" },
  iconBtn: { padding: "9px 14px", borderRadius: "12px", border: "2px solid #E8E8E8", background: "white", fontSize: "12px", fontWeight: 800, cursor: "pointer", position: "relative", fontFamily: "inherit", whiteSpace: "nowrap" },
  conflictBadge: { position: "absolute", top: "-6px", right: "-6px", background: "#FF4757", color: "white", borderRadius: "50%", width: "17px", height: "17px", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 },
  // 基本時間割
  tabBase: { background: "linear-gradient(135deg,#27ae60,#55efc4)", borderColor: "transparent", color: "white", boxShadow: "0 4px 10px rgba(39,174,96,.3)" },
  baseBanner: { background: "linear-gradient(135deg,#f0fff4,#e8f5e9)", border: "1.5px solid #27ae6044", borderRadius: "16px", padding: "16px 20px", marginBottom: "16px", display: "flex", alignItems: "flex-start", gap: "12px" },
  baseBannerTitle: { margin: "0 0 4px", fontSize: "14px", fontWeight: 800, color: "#27ae60" },
  baseBannerDesc: { margin: 0, fontSize: "12px", color: "#555", lineHeight: 1.6 },
  baseEmpty: { textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "18px", boxShadow: "0 4px 18px rgba(0,0,0,.06)" },
  baseInitBtn: { padding: "14px 32px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#27ae60,#2ecc71)", color: "white", fontSize: "15px", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(39,174,96,.4)" },
  conflictBar: { background: "#FFF3F3", border: "1.5px solid #FF4757", borderRadius: "12px", padding: "9px 14px", marginBottom: "12px", fontSize: "12px", color: "#c0392b", fontWeight: 600 },
  tabs: { display: "flex", gap: "6px", flexWrap: "wrap" },
  tab: { padding: "8px 14px", borderRadius: "12px", border: "2px solid #E8E8E8", background: "white", fontSize: "12px", fontWeight: 700, cursor: "pointer", color: "#999", fontFamily: "inherit", transition: "all .18s", position: "relative" },
  tabActive: { background: "linear-gradient(135deg,#667eea,#764ba2)", borderColor: "transparent", color: "white", boxShadow: "0 4px 10px rgba(102,126,234,.4)" },
  tabWeek: { background: "linear-gradient(135deg,#FF6B6B,#FFD93D)", borderColor: "transparent", color: "white", boxShadow: "0 4px 10px rgba(255,107,107,.3)" },
  tabProgress: { background: "linear-gradient(135deg,#27ae60,#2ecc71)", borderColor: "transparent", color: "white", boxShadow: "0 4px 10px rgba(39,174,96,.3)" },
  tabHistory: { background: "linear-gradient(135deg,#2d3436,#636e72)", borderColor: "transparent", color: "white" },
  weekBadge: { position: "absolute", top: "-6px", right: "-6px", background: "#A29BFE", color: "white", borderRadius: "50%", width: "17px", height: "17px", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 },
  card: { background: "white", borderRadius: "18px", padding: "18px 20px", boxShadow: "0 4px 18px rgba(0,0,0,.06)", marginBottom: "14px" },
  sectionLabel: { margin: "0 0 10px", fontSize: "13px", fontWeight: 700, color: "#555" },
  weekNav: { display: "flex", alignItems: "center", gap: "14px", background: "white", borderRadius: "18px", padding: "18px 22px", boxShadow: "0 4px 18px rgba(0,0,0,.07)", marginBottom: "14px", justifyContent: "space-between" },
  weekNavBtn: { padding: "9px 18px", borderRadius: "12px", border: "2px solid #E8E8E8", background: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", color: "#666" },
  weekNavBtnNext: { background: "linear-gradient(135deg,#667eea,#764ba2)", borderColor: "transparent", color: "white", boxShadow: "0 4px 10px rgba(102,126,234,.3)" },
  weekNavCenter: { textAlign: "center" },
  weekNumBig: { fontSize: "24px", fontWeight: 900, color: "#333", lineHeight: 1 },
  weekNumAccent: { fontSize: "36px", background: "linear-gradient(135deg,#FF6B6B,#A29BFE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  weekDateRange: { fontSize: "13px", fontWeight: 700, color: "#667eea", marginTop: "4px", letterSpacing: "0.02em" },
  setDateBtn: { padding: "4px 12px", borderRadius: "8px", border: "1.5px dashed #A29BFE", background: "#F5F3FF", color: "#7c6fe0", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: "4px" },
  changeDateBtn: { padding: "2px 8px", borderRadius: "6px", border: "1px solid #E8E8E8", background: "white", color: "#AAA", fontSize: "10px", cursor: "pointer", fontFamily: "inherit" },
  startDateCard: { background: "#F5F3FF", border: "1.5px solid #A29BFE55", borderRadius: "14px", padding: "14px 18px", marginBottom: "14px" },
  closeDateBtn: { padding: "6px 12px", borderRadius: "8px", border: "1.5px solid #E8E8E8", background: "white", color: "#888", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  savedTag: { fontSize: "11px", color: "#27ae60", fontWeight: 700, background: "#d5f5e3", padding: "2px 8px", borderRadius: "8px" },
  unsavedTag: { fontSize: "11px", color: "#AAA", fontWeight: 600 },
  weekInfoRow: { display: "flex", gap: "14px", flexWrap: "wrap" },
  weekInfoField: { flex: 1, minWidth: "150px" },
  fieldLabel: { display: "block", fontSize: "11px", color: "#AAA", fontWeight: 600, marginBottom: "5px" },
  weekInput: { width: "100%", padding: "8px 11px", borderRadius: "9px", border: "1.5px solid #E8E8E8", fontSize: "13px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
  // 行事
  addEventBtn: { padding: "7px 14px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#FFD93D,#FF9FF3)", color: "#333", fontSize: "12px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit" },
  eventChip: { display: "flex", alignItems: "center", gap: "6px", padding: "5px 10px", borderRadius: "10px", border: "1.5px solid", fontSize: "12px", fontWeight: 600 },
  eventEditBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "12px", padding: "0 2px" },
  eventDeleteBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#CCC", padding: "0 2px" },
  btnRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", flexWrap: "wrap" },
  regenBtn: { padding: "9px 18px", borderRadius: "11px", border: "none", background: "linear-gradient(135deg,#FFD93D,#FF9FF3)", color: "#333", fontSize: "12px", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" },
  saveWeekBtn: { padding: "9px 18px", borderRadius: "11px", border: "none", background: "linear-gradient(135deg,#27ae60,#2ecc71)", color: "white", fontSize: "12px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit" },
  pdfBtn: { padding: "9px 18px", borderRadius: "11px", border: "none", background: "linear-gradient(135deg,#636e72,#2d3436)", color: "white", fontSize: "12px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit" },
  saveMsg: { fontSize: "12px", color: "#27ae60", fontWeight: 700 },
  hint: { fontSize: "11px", color: "#AAA" },
  swapHint: { background: "#EEF2FF", border: "1.5px solid #667eea", borderRadius: "10px", padding: "8px 12px", marginBottom: "10px", fontSize: "12px", color: "#4a56c1", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  swapCancelBtn: { padding: "3px 10px", borderRadius: "7px", border: "1.5px solid #667eea", background: "white", color: "#667eea", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" },
  selectedMark: { position: "absolute", top: "3px", left: "4px", fontSize: "11px", fontWeight: 900, color: "white", background: "#667eea", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 },
  weekPreviewGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "10px" },
  weekPreviewCard: { background: "white", borderRadius: "12px", padding: "10px", boxShadow: "0 3px 10px rgba(0,0,0,.06)", cursor: "pointer", transition: "transform .15s", border: "1.5px solid #F0F0F0" },
  weekPreviewHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" },
  weekPreviewLabel: { fontSize: "15px", fontWeight: 900 },
  gradeGroups: { display: "flex", gap: "20px", flexWrap: "wrap" },
  groupLabel: { margin: "0 0 6px", fontSize: "11px", color: "#AAA", fontWeight: 600 },
  gradeBtns: { display: "flex", gap: "6px", flexWrap: "wrap" },
  gradeBtn: { padding: "7px 12px", borderRadius: "10px", border: "2px solid #E8E8E8", background: "white", fontSize: "12px", fontWeight: 700, cursor: "pointer", color: "#666", fontFamily: "inherit", transition: "all .18s" },
  gradeBtnE: { background: "linear-gradient(135deg,#FF6B6B,#FF9FF3)", borderColor: "transparent", color: "white", boxShadow: "0 3px 10px rgba(255,107,107,.35)", transform: "translateY(-1px)" },
  gradeBtnJ: { background: "linear-gradient(135deg,#4ECDC4,#A29BFE)", borderColor: "transparent", color: "white", boxShadow: "0 3px 10px rgba(162,155,254,.35)", transform: "translateY(-1px)" },
  teacherLegend: { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" },
  teacherTag: { display: "flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "18px", border: "2px solid", background: "white", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" },
  teacherDot: { width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0, display: "inline-block" },
  cornerCell: { width: "52px" },
  dayHeader: { textAlign: "center", fontSize: "11px", fontWeight: 800, color: "#666", padding: "6px 3px", background: "#F8F9FA", borderRadius: "8px" },
  periodLabel: { display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 900, color: "#CCC", width: "52px" },
  cell: { borderRadius: "10px", border: "1.5px solid", padding: "6px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", cursor: "grab", transition: "all .15s", minHeight: "60px", userSelect: "none", position: "relative" },
  cellEmoji: { fontSize: "15px", lineHeight: 1 },
  cellName: { fontSize: "10px", fontWeight: 800, textAlign: "center" },
  cellTeacher: { fontSize: "9px", fontWeight: 700, padding: "1px 4px", borderRadius: "5px", marginTop: "1px", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  conflictMark: { position: "absolute", top: "2px", right: "3px", fontSize: "10px" },
  miniDayHeader: { textAlign: "center", fontSize: "8px", fontWeight: 700, color: "#999", padding: "2px 0", background: "#F8F9FA", borderRadius: "4px" },
  miniPeriodLabel: { display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", fontWeight: 700, color: "#CCC" },
  miniCell: { borderRadius: "4px", border: "1px solid", padding: "1px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "18px" },
  miniCellName: { fontSize: "7px", fontWeight: 800, textAlign: "center", lineHeight: 1.1 },
  // 全学年
  allSection: { marginBottom: "24px" },
  allSectionTitle: { margin: "0 0 12px", fontSize: "17px", fontWeight: 900 },
  allGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "12px" },
  allCard: { background: "white", borderRadius: "13px", padding: "12px", boxShadow: "0 3px 12px rgba(0,0,0,.07)" },
  allCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" },
  allCardTitle: { fontSize: "16px", fontWeight: 900 },
  allCardEdit: { padding: "4px 9px", borderRadius: "7px", border: "1.5px solid #E8E8E8", background: "white", fontSize: "11px", fontWeight: 700, cursor: "pointer", color: "#666", fontFamily: "inherit" },
  // 進捗
  progressHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px", flexWrap: "wrap", gap: "12px" },
  progressTitle: { margin: 0, fontSize: "20px", fontWeight: 900, color: "#333" },
  progressMeta: { fontSize: "13px", color: "#888" },
  progressGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "12px" },
  progressCard: { background: "#FAFAFA", borderRadius: "14px", padding: "14px", border: "1.5px solid #F0F0F0" },
  progressCardTop: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" },
  progressEmoji: { fontSize: "18px" },
  progressSubjectName: { flex: 1, fontSize: "13px", fontWeight: 800, color: "#444" },
  progressPct: { fontSize: "18px", fontWeight: 900 },
  progressBarBg: { height: "8px", background: "#EEE", borderRadius: "4px", overflow: "hidden", marginBottom: "6px" },
  progressBarFill: { height: "100%", borderRadius: "4px", transition: "width .5s" },
  progressDetail: { fontSize: "11px", color: "#888" },
  progressRemain: { fontSize: "11px", color: "#AAA", marginTop: "2px" },
  // ヒートマップ
  heatTable: { borderCollapse: "collapse", width: "100%", fontSize: "12px" },
  heatTh: { padding: "8px 10px", fontWeight: 800, textAlign: "center", borderBottom: "2px solid #F0F0F0", whiteSpace: "nowrap", fontSize: "11px" },
  heatSubject: { padding: "7px 10px", fontWeight: 700, color: "#555", whiteSpace: "nowrap", borderBottom: "1px solid #F8F8F8" },
  heatCell: { padding: "7px 8px", textAlign: "center", fontWeight: 600, borderRadius: "6px", borderBottom: "1px solid #F8F8F8", fontSize: "11px" },
  heatLegend: { display: "flex", gap: "12px", marginTop: "12px", flexWrap: "wrap" },
  heatLegendItem: { padding: "3px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 700 },
  // 年間時数
  hoursCard: { background: "#FAFAFA", borderRadius: "12px", padding: "12px", border: "1.5px solid" },
  hoursInput: { width: "70px", padding: "6px 8px", borderRadius: "8px", border: "1.5px solid", fontSize: "13px", fontFamily: "inherit", outline: "none", textAlign: "center" },
  // 履歴
  historyHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" },
  historyTitle: { margin: 0, fontSize: "20px", fontWeight: 900, color: "#333" },
  historyCount: { background: "#A29BFE", color: "white", borderRadius: "18px", padding: "3px 11px", fontSize: "12px", fontWeight: 700 },
  emptyHistory: { textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "18px", boxShadow: "0 4px 18px rgba(0,0,0,.06)" },
  historyList: { display: "flex", flexDirection: "column", gap: "14px" },
  historyCard: { background: "white", borderRadius: "18px", padding: "18px", boxShadow: "0 4px 14px rgba(0,0,0,.07)" },
  historyCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", gap: "10px", flexWrap: "wrap" },
  historyCardLeft: { display: "flex", alignItems: "flex-start", gap: "14px" },
  historyWeekNum: { fontSize: "28px", fontWeight: 900, background: "linear-gradient(135deg,#FF6B6B,#A29BFE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1, whiteSpace: "nowrap" },
  historyLabel: { margin: "0 0 3px", fontSize: "15px", fontWeight: 800, color: "#333" },
  historyNote: { margin: "0 0 3px", fontSize: "11px", color: "#888" },
  historyDate: { margin: 0, fontSize: "10px", color: "#BBB" },
  historyCardActions: { display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" },
  historyLoadBtn: { padding: "7px 14px", borderRadius: "9px", border: "none", background: "linear-gradient(135deg,#667eea,#764ba2)", color: "white", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  historyPdfBtn: { padding: "7px 11px", borderRadius: "9px", border: "none", background: "linear-gradient(135deg,#636e72,#2d3436)", color: "white", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  historyDeleteBtn: { padding: "7px 9px", borderRadius: "9px", border: "1.5px solid #FFE0E0", background: "white", color: "#FF4757", fontSize: "13px", cursor: "pointer" },
  historyPreviewGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: "8px" },
  historyPreviewGrade: { margin: "0 0 4px", fontSize: "11px", fontWeight: 800 },
  // モーダル
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1e3, padding: "14px" },
  modal: { background: "white", borderRadius: "22px", width: "min(900px,100%)", maxHeight: "88vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,.25)" },
  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px 14px", borderBottom: "1.5px solid #F0F0F0" },
  modalTitle: { margin: 0, fontSize: "18px", fontWeight: 900, color: "#333" },
  closeBtn: { background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#999", padding: "4px" },
  modalBody: { display: "flex", flex: 1, overflow: "hidden", minHeight: 0 },
  modalFooter: { padding: "12px 22px", borderTop: "1.5px solid #F0F0F0", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px" },
  conflictNote: { fontSize: "12px", color: "#c0392b", fontWeight: 600 },
  applyBtn: { padding: "10px 22px", borderRadius: "11px", border: "none", background: "linear-gradient(135deg,#667eea,#764ba2)", color: "white", fontSize: "13px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit" },
  panelLabel: { margin: "0 0 9px", fontSize: "12px", fontWeight: 700, color: "#555" },
  teacherList: { width: "200px", borderRight: "1.5px solid #F0F0F0", padding: "18px 14px", overflowY: "auto", flexShrink: 0 },
  teacherRow: { display: "flex", alignItems: "center", gap: "7px", padding: "8px 9px", borderRadius: "9px", cursor: "pointer", marginBottom: "5px", border: "1.5px solid transparent", transition: "all .15s" },
  teacherRowName: { flex: 1, fontSize: "12px", fontWeight: 700, color: "#333" },
  teacherRowCount: { fontSize: "10px", color: "#AAA", whiteSpace: "nowrap" },
  removeBtn: { background: "none", border: "none", cursor: "pointer", color: "#CCC", fontSize: "13px", padding: "0 2px" },
  addTeacherRow: { display: "flex", gap: "5px", marginTop: "10px" },
  addInput: { flex: 1, padding: "6px 9px", borderRadius: "8px", border: "1.5px solid #E8E8E8", fontSize: "12px", fontFamily: "inherit", outline: "none" },
  addBtn: { padding: "6px 11px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg,#667eea,#764ba2)", color: "white", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  assignPanel: { flex: 1, padding: "18px", overflowY: "auto" },
  assignPlaceholder: { color: "#CCC", fontSize: "13px", textAlign: "center", marginTop: "50px" },
  assignScroll: { display: "flex", flexDirection: "column", gap: "12px" },
  assignGradeBlock: {},
  assignGradeLabel: { margin: "0 0 5px", fontSize: "12px", fontWeight: 800 },
  assignSubjects: { display: "flex", flexWrap: "wrap", gap: "5px" },
  periodStepBtn: { width: "32px", height: "24px", borderRadius: "6px", border: "1.5px solid #E8E8E8", background: "white", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" },
  periodValueBox: { width: "40px", height: "40px", borderRadius: "10px", border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 900 },
  gradeGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  gradeGroupLabel: { fontSize: "10px", fontWeight: 700, color: "#AAA", letterSpacing: "0.05em" },
  gradeQuickBtn: { padding: "3px 10px", borderRadius: "7px", border: "1.5px solid #A29BFE", background: "white", color: "#7c6fe0", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  infoNote: { marginTop: "8px", padding: "7px 11px", borderRadius: "8px", background: "#F0F4FF", border: "1px solid #A29BFE55", fontSize: "11px", color: "#5c6bc0", lineHeight: 1.5 },
  footer: { marginTop: "20px", textAlign: "center", fontSize: "10px", color: "#BBB" }
};
var _root = ReactDOM.createRoot(document.getElementById("root"));
_root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
export {
  App as default
};
