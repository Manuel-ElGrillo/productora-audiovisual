import { Router } from 'express';

import MongoBookingRepository from '../../database/05-2-repositories/MongoBookingRepository.js';
import MongoServiceRepository from '../../database/05-2-repositories/MongoServiceRepository.js';
import CreateBookingInteractor from "../../../03-use-cases/03-1Create-booking/CreateBookingInteractor.js";
import BookingPresenter from '../../../04-adapters/04-2-presenters/BookingPresenter.js';
import BookingController from "../../../04-adapters/04-1-controllers/BookingController.js";

const router = Router();
const bookingRepository = new MongoBookingRepository();
const serviceRepository = new MongoServiceRepository();
const bookingPresenter = new BookingPresenter();

const createBookingInteractor = new CreateBookingInteractor(
  bookingRepository,
  serviceRepository,
  bookingPresenter
);

const bookingController = new BookingController(createBookingInteractor);

router.post('/', bookingController.createBooking);

router.get('/', async (req, res) => {
  try {
    const bookings = await bookingRepository.findAll();
    res.status(200).json({
      status: 'success',
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;