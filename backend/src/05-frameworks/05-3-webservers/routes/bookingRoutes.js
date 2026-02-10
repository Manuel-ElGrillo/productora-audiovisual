import { Router } from 'express';

import MongoBookingRepository from '../../database/repositories/MongoBookingRepository.js';
import CreateBookingInteractor from '../../../use-cases/CreateBooking/CreateBookingInteractor.js';
import BookingPresenter from '../../../adapters/presenters/BookingPresenter.js';
import BookingController from '../../../adapters/controllers/BookingController.js';

const router = Router();
const bookingRepository = new MongoBookingRepository();
const bookingPresenter = new BookingPresenter();

const createBookingInteractor = new CreateBookingInteractor(
  bookingRepository,
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