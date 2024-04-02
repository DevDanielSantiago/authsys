import { Router } from 'express';

import { handleError } from '../utils/errorHandler';
import { validateAllowedFields } from '../utils/validateFields';

import User from '../models/User';
import formatResponse from '../helpers/responseHelper';

const router = Router();

router.post('/', async (req, res) => {
  const allowedFields = ['username', 'email', 'password'];
  const errors = validateAllowedFields(Object.keys(req.body), allowedFields);
  
  if (Object.keys(errors).length)
    return res.status(400).json({ status: 400, errors });

  try {
    const user = new User(req.body);
    await user.save();

    res.status(201).send(formatResponse(user));
  } catch (error) {
    handleError(error as Error, res);
  }
});

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.headers.page as string) || 1;
    const limit = parseInt(req.headers.limit as string) || 10;

    const filterString = req.headers.filter;
    let filter: Record<string, any> = {};

    try {
      if (filterString) filter = JSON.parse(filterString as string);
    } catch (parseError) {
      return res.status(400).send({ status: 400, errors: { filter: 'malFormatted'} });
    }

    const allowedFields = ['username', 'email'];
    allowedFields.forEach(field => {
      if (filter[field]) 
        filter[field] = new RegExp(filter[field], 'i');
    });

    const skip = (page - 1) * limit;
    const list = await User.find(filter, '-password -__v').skip(skip).limit(limit);
    const total = await User.countDocuments(filter);

    res.json({ total, list: formatResponse(list) });
  } catch (error) {
    handleError(error as Error, res);
  }
});

router.patch('/:id', async (req, res) => {
  const allowedFields = ['username'];
  const errors = validateAllowedFields(Object.keys(req.body), allowedFields);
  
  if (Object.keys(errors).length)
    return res.status(400).json({ errors });
  
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).send({ status: 400, errors: { user: 'notFound'} });   

    res.status(200).send(formatResponse(user));
  } catch (error) {
    handleError(error as Error, res);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { 
      deleted: true, deletedAt: new Date() 
    }, { new: true });

    if (!user) return res.status(404).send({ status: 400, errors: { user: 'notFound'} })

    res.status(200).send(formatResponse(user));
  } catch (error) {
    handleError(error as Error, res);
  }
});

router.post('/restore/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    // const user = await User.findByIdAndUpdate(userId, { deleted: false, deletedAt: null }, { new: true });
    const user = await User.restore({ _id: userId });
    
    if (!user)
      return res.status(404).send({ status: 400, errors: { user: 'notFound'} });

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
