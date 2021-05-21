import { TelegramAPICall } from './core';
import dotenv from 'dotenv';

dotenv.config();

TelegramAPICall.getMe();
// TelegramAPICall.getNewestMessage();