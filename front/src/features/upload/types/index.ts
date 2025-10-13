import { Dispatch, SetStateAction } from 'react';

export type AxiosErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
};

export interface ExistingValue {
  attribute: string;
  value: string;
}

export interface UploadListState {
  existingValues: ExistingValue[];
  noExistingAttributes: string[];
  attributeNotFoundList: string[];
}

export type SetUploadList = Dispatch<SetStateAction<UploadListState>>;

export type UploadResult = UploadListState;
