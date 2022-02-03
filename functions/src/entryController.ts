import {Response} from 'express';
import {db} from './config/firebase';
import getErrorMessage from './utils/errorMessage';

type EntryType = {
    title: string,
    text: string
}

type Request = {
    body: EntryType,
    params: {entryId: string}
}

const addEntry = async (req: Request, res: Response): Promise<void> => {
  const {title, text} = req.body;
  try {
    const entry = db.collection('entries').doc();
    const entryObject = {
      id: entry.id,
      title,
      text,
    };

    entry.set(entryObject);
    res.status(200).send({
      message: 'entry added',
      data: entryObject,
    });
  } catch (error) {
    res.status(500).json(getErrorMessage(error));
  }
};

const getAllEntries = async (req: Request, res: Response): Promise<void> => {
  try {
    const allEntries: EntryType[] = [];
    const querySnapshot = await db.collection('entries').get();
    querySnapshot.forEach((doc: any) => allEntries.push(doc.data()));
    res.status(200).json(allEntries);
  } catch (error) {
    res.status(500).json(getErrorMessage(error));
  }
};

const updateEntry = async (req: Request, res: Response): Promise<void> => {
  const {body: {text, title}, params: {entryId}} = req;

  try {
    const entry = db.collection('entries').doc(entryId);
    const currentData = (await entry.get()).data() || {};
    const entryObject = {
      title: title || currentData.title,
      text: text || currentData.text,
    };

    await entry.set(entryObject);
    res.status(200).json({
      message: 'entry updated',
      data: entryObject,
    });
  } catch (error) {
    res.status(500).json(getErrorMessage(error));
  }
};

const deleteEntry = async (req: Request, res: Response): Promise<void> => {
  const {params: {entryId}} = req;

  try {
    const entry = db.collection('entries').doc(entryId);
    await entry.delete();

    res.status(200).json({
      message: 'entry deleted',
    });
  } catch (error) {
    res.status(500).json(getErrorMessage(error));
  }
};

export {addEntry, getAllEntries, updateEntry, deleteEntry};
