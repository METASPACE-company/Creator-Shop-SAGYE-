import { GestureModule } from './GestureModule';
import { Module } from './Module';
import { SeatModule } from './SeatModule';
import { SyncModule } from './SyncModule';
import { TimeModule } from './TimeModule';

const modules: Module[] = [
  new SyncModule(),
  new TimeModule(),
  new GestureModule(),
  new SeatModule(),
];

export default modules;
