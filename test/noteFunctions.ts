/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import {Application} from 'express';
import {NoteTest} from '../src/types/DBTypes';

// add test for graphql query
/*
query NoteById($noteId: ID!) {
  noteById(id: $noteId) {
    _id
    title
    content
    owner {
      _id
      user_name
      email
      filename
    }
    collaborators {
      _id
      user_name
      email
      filename
    }
  }
}
*/

const getSingleNote = (
  url: string | Application,
  id: string,
  token: string,
): Promise<NoteTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `query NoteById($noteId: ID!) {
          noteById(id: $noteId
          ) {
            id
            title
            content
            owner {
              id
              user_name
              email
              filename
            }
            collaborators {
              id
              user_name
              email
              filename
            }
          }
        }`,
        variables: {
          noteId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const note = response.body.data.noteById;
          expect(note.id).toBe(id);
          expect(note).toHaveProperty('title');
          expect(note).toHaveProperty('content');
          expect(note).toHaveProperty('owner');
          expect(note.owner).toHaveProperty('id');
          expect(note.owner).toHaveProperty('user_name');
          expect(note.owner).toHaveProperty('email');
          expect(note.owner).toHaveProperty('filename');
          expect(note).toHaveProperty('collaborators');
          expect(note.collaborators).toBeInstanceOf(Array);
          resolve(note);
        }
      });
  });
};

// add test for graphql query
/*
  query OwnedNotes {
    ownedNotes {
      _id
      title
      content
      owner {
        _id
        user_name
        email
        filename
      }
      collaborators {
        _id
        user_name
        email
        filename
      }
    }
  }
 */

const getOwnedNotes = (
  url: string | Application,
  token: string,
): Promise<NoteTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `query OwnedNotes {
          ownedNotes {
            id
            title
            content
            owner {
              id
              user_name
              email
              filename
            }
            collaborators {
              id
              user_name
              email
              filename
            }
          }
        }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const notes = response.body.data.ownedNotes;
          notes.forEach((note: NoteTest) => {
            expect(note).toHaveProperty('id');
            expect(note).toHaveProperty('title');
            expect(note).toHaveProperty('content');
            expect(note).toHaveProperty('owner');
            expect(note.owner).toHaveProperty('id');
            expect(note).toHaveProperty('collaborators');
            expect(note.collaborators).toBeInstanceOf(Array);
          });
          resolve(notes);
        }
      });
  });
};

// add test for graphql query
/*
  query SharedNotes {
    sharedNotes {
      _id
      title
      content
      owner {
        _id
        user_name
        email
        filename
      }
      collaborators {
        _id
        user_name
        email
        filename
      }
    }
  }
 */

const getSharedNotes = (
  url: string | Application,
  token: string,
): Promise<NoteTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `query SharedNotes {
          sharedNotes {
            id
            title
            content
            owner {
              id
              user_name
              email
              filename
            }
            collaborators {
              id
              user_name
              email
              filename
            }
          }
        }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const notes = response.body.data.sharedNotes;
          notes.forEach((note: NoteTest) => {
            expect(note).toHaveProperty('id');
            expect(note).toHaveProperty('title');
            expect(note).toHaveProperty('content');
            expect(note).toHaveProperty('owner');
            expect(note.owner).toHaveProperty('id');
            expect(note).toHaveProperty('collaborators');
            expect(note.collaborators).toBeInstanceOf(Array);
          });
          resolve(notes);
        }
      });
  });
};

// add test for graphql query
/*
query CreateNote($title: String!, $content: String) {
  createNote(title: $title, content: $content) {
    message
    note {
      _id
      title
      content
      owner {
        _id
        user_name
        email
        filename
      }
      collaborators {
        _id
        user_name
        email
        filename
      }
    }
  }
}
*/

const createNote = (
  url: string | Application,
  title: string,
  content: string,
  token: string,
): Promise<NoteTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation CreateNote($title: String!, $content: String) {
          createNote(title: $title, content: $content) {
            message
            note {
              id
              title
              content
              owner {
                id
                user_name
                email
                filename
              }
              collaborators {
                id
                user_name
                email
                filename
              }
            }
          }
        }`,
        variables: {
          title: title,
          content: content,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const note = response.body.data.createNote.note;
          expect(note).toHaveProperty('id');
          expect(note).toHaveProperty('title');
          expect(note).toHaveProperty('content');
          expect(note).toHaveProperty('owner');
          expect(note.owner).toHaveProperty('id');
          expect(note).toHaveProperty('collaborators');
          expect(note.collaborators).toBeInstanceOf(Array);
          resolve(note);
        }
      });
  });
};

// add test for graphql query
/*
mutation UpdateNote($id: ID!, $title: String!, $content: String) {
  updateNote(id: $id, title: $title, content: $content) {
    message
    note {
      _id
      title
      content
      owner {
        _id
        user_name
        email
        filename
      }
      collaborators {
        _id
        user_name
        email
        filename
      }
    }
  }
}
*/

const updateNote = (
  url: string | Application,
  id: string,
  title: string,
  content: string,
  token: string,
): Promise<NoteTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation UpdateNote($id: ID!, $title: String!, $content: String) {
          updateNote(id: $id, title: $title, content: $content) {
            message
            note {
              id
              title
              content
              owner {
                id
                user_name
                email
                filename
              }
              collaborators {
                id
                user_name
                email
                filename
              }
            }
          }
        }`,
        variables: {
          id: id,
          title: title,
          content: content,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const note = response.body.data.updateNote.note;
          expect(note).toHaveProperty('id');
          expect(note).toHaveProperty('title');
          expect(note).toHaveProperty('content');
          expect(note).toHaveProperty('owner');
          expect(note.owner).toHaveProperty('id');
          expect(note).toHaveProperty('collaborators');
          expect(note.collaborators).toBeInstanceOf(Array);
          resolve(note);
        }
      });
  });
};

// add test for graphql query
/*
/*
  mutation ShareNoteWithUser($noteId: ID!, $userId: ID!) {
    shareNoteWithUser(note_id: $noteId, user_id: $userId) {
      message
    note {
      _id
      title
      content
      owner {
        _id
        user_name
        email
        filename
      }
      collaborators {
        _id
        user_name
        email
        filename
      }
    }
  }
*/

const shareNoteWithUser = (
  url: string | Application,
  noteId: string,
  userId: string,
  token: string,
): Promise<NoteTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation ShareNoteWithUser($noteId: ID!, $userId: ID!) {
          shareNoteWithUser(note_id: $noteId, user_id: $userId) {
            message
            note {
              id
              title
              content
              owner {
                id
                user_name
                email
                filename
              }
              collaborators {
                id
                user_name
                email
                filename
              }
            }
          }
        }`,
        variables: {
          noteId: noteId,
          userId: userId,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const note = response.body.data.shareNoteWithUser.note;
          expect(note).toHaveProperty('id');
          expect(note).toHaveProperty('title');
          expect(note).toHaveProperty('content');
          expect(note).toHaveProperty('owner');
          expect(note.owner).toHaveProperty('id');
          expect(note).toHaveProperty('collaborators');
          expect(note.collaborators).toBeInstanceOf(Array);
          resolve(note);
        }
      });
  });
};

// add test for graphql query
/*
mutation UnshareNoteWithUser($noteId: ID!, $userId: ID!) {
  unshareNoteWithUser(note_id: $noteId, user_id: $userId) {
    message
    note {
      _id
      title
      content
      owner {
        _id
        user_name
        email
        filename
      }
      collaborators {
        _id
        user_name
        email
        filename
      }
    }
  }
}
*/

const unshareNoteWithUser = (
  url: string | Application,
  noteId: string,
  userId: string,
  token: string,
): Promise<NoteTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation UnshareNoteWithUser($noteId: ID!, $userId: ID!) {
          unshareNoteWithUser(note_id: $noteId, user_id: $userId) {
            message
            note {
              id
              title
              content
              owner {
                id
                user_name
                email
                filename
              }
              collaborators {
                id
                user_name
                email
                filename
              }
            }
          }
        }`,
        variables: {
          noteId: noteId,
          userId: userId,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const note = response.body.data.unshareNoteWithUser.note;
          expect(note).toHaveProperty('id');
          expect(note).toHaveProperty('title');
          expect(note).toHaveProperty('content');
          expect(note).toHaveProperty('owner');
          expect(note.owner).toHaveProperty('id');
          expect(note).toHaveProperty('collaborators');
          expect(note.collaborators).toBeInstanceOf(Array);
          resolve(note);
        }
      });
  });
};

// add test for graphql query
/*
mutation DeleteNote($id: ID!) {
  deleteNote(id: $id) {
    message
  }
}
*/

const deleteNote = (
  url: string | Application,
  id: string,
  token: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation DeleteNote($id: ID!) {
          deleteNote(id: $id) 
        }`,
        variables: {
          id: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message = response.body.data.deleteNote.message;
          resolve(message);
        }
      });
  });
};

export {
  getSingleNote,
  getOwnedNotes,
  getSharedNotes,
  createNote,
  updateNote,
  shareNoteWithUser,
  unshareNoteWithUser,
  deleteNote,
};
