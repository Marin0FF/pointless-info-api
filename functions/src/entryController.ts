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

export {addEntry, getAllEntries};
