# RestMaker

[![🚀 Run Tests](https://github.com/icoseuk/restmaker/actions/workflows/test.yml/badge.svg)](https://github.com/icoseuk/restmaker/actions/workflows/test.yml)

A TypeScript utility to connect to the FileMaker Data API (REST) seamlessly.

## Table of Contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Creating a record](#creating-a-record)
    - [Editing a record](#editing-a-record)
    - [Duplicate a record](#duplicate-a-record)
    - [Delete a record](#delete-a-record)
    - [Get a record](#get-a-record)
    - [Get a range of records](#get-a-range-of-records)
    - [Find records](#find-records)
    - [Running a script in a request](#running-a-script-in-a-request)
    - [Running a script standalone](#running-a-script-standalone)
- [Contributing](#contributing)

## Getting Started

### Installation

```bash
npm install @icose/restmaker
```

### Usage

This library is designed to work with the FileMaker Data API (REST). To use this library, you need to have a FileMaker Server with the Data API enabled. Start by creating a new instance of `RestMaker` with the server details:

```typescript
import { RestMaker } from '@icose/restmaker'

const restMaker = new RestMaker({
  host: 'your-fm-server.com',
  database: 'your-database',
  username: 'your-username',
  password: 'your-password'
})
```

Take a look at the methods below to see how you can interact with the FileMaker Data API.

#### Creating a record

To create a record, you need to provide the layout name and the field data. Here is a complete example with type definitions:

```typescript
const record = await restMaker.createRecord<YourRecordFields>({
  layout: 'your-layout',
  fieldData: {
    field1: 'value1',
    field2: 1234
  }
})
```

#### Editing a record

To update a record, you need to provide the layout name, the record ID, and the field data. Here is a complete example:

```typescript
type YourRecordPortalFields = {
  portal1: {
    recordId: string
    field1: string
    field2: number
  }
}

const record = await restMaker.editRecord<
  YourRecordFields,
  YourRecordPortalFields
>({
  layout: 'your-layout',
  recordId: 'your-record-id',
  fieldData: {
    field1: 'value1',
    field2: 1234
  },
  portalData: {
    portal1: [
      {
        recordId: 'portal-record-id',
        field1: 'portal-value1',
        field2: 5678
      }
    ]
  }
})
```

#### Duplicate a record

To duplicate a record, you need to provide the layout name and the record ID. Here is a complete example:

```typescript
const record = await restMaker.duplicateRecord({
  layout: 'your-layout',
  recordId: 'your-record-id'
})
```

#### Delete a record

To delete a record, you need to provide the layout name and the record ID. Here is a complete example:

```typescript
const record = await restMaker.deleteRecord({
  layout: 'your-layout',
  recordId: 'your-record-id'
})
```

#### Get a record

To get a record, you need to provide the layout name and the record ID. Here is a complete example with type definitions, including the layout response and the portals:

```typescript
const record = await restMaker.getRecord<
  YourRecordFields,
  YourRecordPortalFields
>({
  layout: 'your-layout',
  recordId: 'your-record-id',
  layoutResponse: 'your-relevant-layout',
  portals = ['portal1', 'portal2']
})
```

#### Get a range of records

To get a range of records, you need to provide the layout name and the range. Here is a complete example with type definitions, including the layout response, portals and sorting:

```typescript
const records = await restMaker.getRecordRange<YourRecordFields, YourRecordPortalFields>({
  layout: 'your-layout',
  startingIndex: 1,
  limit: 10,
  layoutResponse: 'your-relevant-layout',
  portals = [
    {
        name: 'portal1',
        limit: 10
        offset: 5
    }
  ],
  sort = [
    {
      field: 'field1',
      order: 'asc'
    }
  ]
})
```

#### Find records

To find records, you need to provide the layout name and the query. Here is a complete example with type definitions, including the layout response, portals and sorting:

```typescript
const records = await restMaker.findRecords<YourRecordFields, YourRecordPortalFields>({
  layout: 'your-layout',
  query: [
    {
        field1: 'value1'
    },
    {
        field1: 'value1'
        omit: true
    }
  ],
  layoutResponse: 'your-relevant-layout',
  portals = [
    {
        name: 'portal1',
        limit: 10
        offset: 5
    }
  ],
  sort = [
    {
      field: 'field1',
      order: 'ascend'
    }
  ]
})
```

#### Running a script in a request

You can also include the execution of a script in a lifecycle stage of a request. Here is a complete example:

```typescript
const records = await restMaker.findRecords<YourRecordFields>({
  layout: 'your-layout',
  query: [
    {
      field1: 'value1'
    }
  ],
  sort = [
    {
      field: 'field1',
      order: 'ascend'
    }
  ],
  // This will run the script after the record is created,
  script: {
    name: 'your-script',
    param: 'your-param'
  },
  // This will run the script before the record is created,
  prerequestScript: {
    name: 'your-prerequest-script',
    param: 'your-param'
  },
  // This will run the script after the record is created,
  presortScript: {
    name: 'your-presort-script',
    param: 'your-param'
  }
})
```

#### Running a script standalone

You can also run a script standalone without any request. Here is a complete example:

```typescript
const result = await restMaker.runScript({
  layout: 'your-layout',
  scriptName: 'your-script',
  scriptParameter: 'your-param'
})

## Contributing

Check out the [Contributing Guidelines](CONTRIBUTING.md) to get started on contributing to this repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```
