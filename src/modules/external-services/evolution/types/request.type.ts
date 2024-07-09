export type ListMessage = {
  number: string;
  options: {
    delay: number;
    presence: string;
  };
  listMessage: {
    title: string;
    description: string;
    buttonText: string;
    sections: {
      title: string;
      rows: {
        title: string;
        description?: string;
        rowId: string;
      }[];
    }[];
  };
};

export type RowListMessage = {
  title: string;
  description?: string;
  rowId: string;
};

export type SendPlainTextData = {
  instance: string;
  baseUrl: string;
  apiKey: string;
  data: ListMessage;
};
