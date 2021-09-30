import React, { useState } from 'react';
import { useEffect } from 'react';
import generateMessage, { Message } from './Api';
import Header from './components/header';
import Card from './components/card';
import Button from './components/button';
import { Column, Row } from './components/grid';
import styled from 'styled-components';
import { Snackbar } from '@material-ui/core';


type MessageGroup = {
  errors: Message[];
  warnings: Message[];
  info: Message[];
}

const ClearRow = styled.div`
display: flex;
padding-top: 10px;
justify-content: end;
`;

const App: React.FC<{}> = () => {
  const [messages, setMessages] = useState<MessageGroup>({ errors: [], warnings: [], info: [] });
  const [cleanUp, setCleanUp] = useState<null | (() => void)>(null);
  const [open, setOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    return start();
  }, []);

  const start = () => {
    const cleanUpCallback = generateMessage((message: Message) => {
      if (message.priority == 0) {
        setSnackbarMessage(message.message);
      }
      setMessages(group => {
        let errors = group.errors;
        let warnings = group.warnings;
        let info = group.info;
        if (message.priority === 0) {
          errors = [message, ...group.errors];
        } else if (message.priority === 1) {
          warnings = [message, ...group.warnings];
        } else if (message.priority === 2) {
          info = [message, ...group.info];
        }
        return { errors, warnings, info };
      });
    });
    setCleanUp(() => cleanUpCallback);
    return cleanUpCallback;
  }

  const stop = () => {
    if (cleanUp) {
      cleanUp();
      setCleanUp(null);
    }
  }

  const clearAll = () => {
    setMessages({ errors: [], warnings: [], info: [] });
  }

  const clear = (item: Message, type: string) => {
    let errors = messages.errors;
    let warnings = messages.warnings;
    let info = messages.info;
    let list: Message[] | null = null;
    if (type == "error") {
      list = errors;
    } else if (type == "warning") {
      list = warnings;
    } else if (type == "info") {
      list = info;
    }
    if (list) {
      const index = list.findIndex(x => x.message === item.message && x.priority === item.priority);
      if (index !== -1) {
        list.splice(index, 1);
      }
    }
    setMessages({ errors, warnings, info });
  }

  const openSnackbar = () => {
    setOpen(true);
  };

  const closeSnackbar = () => {
    setOpen(false);
  };

  const renderGroups = (title: string, type: string, list: Message[]) => {
    const background = type === 'error' ? '#F56236' : type === 'warning' ? '#FCE788' : '#88FCA3';
    return (
      <div>
        <h3>{title}</h3>
        <div>count {list.length}</div>
        <div>
          {list.map((item: Message) => {
            return <Card key={item.message} background={background}>
              <div>{item.message}</div>
              <ClearRow onClick={() => clear(item, type)}>clear</ClearRow>
            </Card>;
          })
          }
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header>nunffsaid.com Coding Challenge</Header>
      <div>
        {!cleanUp ?
          <Button onClick={start}>Start</Button> :
          <Button onClick={stop}>Stop</Button>
        }
        <Button onClick={clearAll}>Clear</Button>
      </div>
      <Row>
        <Column width="33%">
          {renderGroups('Error Type 1', 'error', messages.errors)}
        </Column>
        <Column width="33%">
          {renderGroups('Warning Type 2', 'warning', messages.warnings)}
        </Column>
        <Column width="33%">
          {renderGroups('Info Type 3', 'info', messages.info)}
        </Column>
      </Row>
      <Snackbar open={!!snackbarMessage} onClose={closeSnackbar}><div>{snackbarMessage}</div></Snackbar>
    </div>
  );
}

export default App;
