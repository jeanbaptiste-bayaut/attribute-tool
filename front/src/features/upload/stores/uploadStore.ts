import { useState } from 'react';
import { UploadListState, SetUploadList } from '../types';

export function useUploadList(): [UploadListState, SetUploadList] {
  const [list, setList] = useState<UploadListState>({
    existingValues: [],
    noExistingAttributes: [],
    attributeNotFoundList: [],
  });

  return [list, setList];
}
