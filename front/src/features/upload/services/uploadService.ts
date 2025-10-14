import { SetUploadList } from '../types';

export function clearList(setList: SetUploadList) {
  setList({
    existingValues: [],
    noExistingAttributes: [],
    attributeNotFoundList: [],
  });
}

// Add other upload-related business logic here (parsing helpers, validation, etc.)
