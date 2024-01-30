import axios from "axios";
import React, { FC } from "react";
import {
    Form,
    Button,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from "reactstrap";
import { link } from "../../../api/link";
import { IModal } from "../../../interfaces/IModal";

export const ClickModal: FC<IModal> = ({token, toggle, modal, itemId}) => {
  const [userData, setUser]= React.useState()

  React.useEffect(()=>{
    (async () => {
        try {
          const response = await axios.get(`${link}/api/users/me?populate=*`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser(response.data);
        } catch (error) {
          console.error(error);
        }
      })();
  },[token])
  
  const updateUserResponses = async () => {
    try {
      await axios.put(
        `${link}/api/items/${itemId}?populate=*`,
        {
            attributes: {
                user_responses: userData
            }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Отклик на объявление</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="exampleFile">File</Label>
            <Input
              type="text"
              name="user_responses"
              id="exampleFile"
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={updateUserResponses}>
          Отправить
        </Button>
        <Button color="secondary" onClick={toggle}>
          Отменить
        </Button>
      </ModalFooter>
    </Modal>
  );
};
