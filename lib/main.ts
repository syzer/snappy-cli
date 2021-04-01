#!/usr/bin/env node
import { program } from './cli';

program.parse(process.argv.slice(2));
