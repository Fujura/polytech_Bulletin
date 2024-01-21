import React, { FC } from "react";
import { IUploadAvatar } from "../../../interfaces/IUploadAvatar";
import { link } from "../../../api/link";
import axios from "axios";
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
import styles from '/src/styles/Profile.module.css'
  
export const UploadAvatar: FC<IUploadAvatar> = ({
  token,
  userId,
  username,
  avatarUrl,
  setUserUpdated,
}) => {
  const [modal, setModal] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File | null>(null);

  const toggle = () => {
    setModal(!modal);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files?.length) {
      const { type } = files[0];
      if (type === "image/png" || type === "image/jpeg") {
        setFile(files[0]);
      } else {
        console.error();
      }
    }
  };

  const updateUserAvatarId = async (avatarId: number, avatarUrl: string) => {
    try {
      await axios.put(
        `${link}/api/users/${userId}`,
        { avatarId, avatarUrl },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserUpdated(true);
    } catch (error) {
      console.log({ error });
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      console.error("File is required");
      return;
    }

    try {
      const files = new FormData();
      files.append("files", file);
      files.append("name", `${username}`);

      const {
        data: [{ id, url }],
      } = await axios.post(
        `${link}/api/upload`,
        files,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        updateUserAvatarId(id, url);
        setFile(null)
        setModal(false)
      
    } catch (error) {
      console.error({ error });
    }
  };
  return <div>
    <button onClick={toggle} className={styles.toggle__Btn}>
        {`${avatarUrl ? 'Изменить' : 'Загрузить'} фотографию`}
    </button>

    <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{`${
          avatarUrl ? "Change" : "Upload"
        } your avatar`}</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="exampleFile">File</Label>
              <Input
                type="file"
                name="file"
                id="exampleFile"
                onChange={handleFileChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Upload
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
  </div>
};
