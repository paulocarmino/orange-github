import React, {useState, useRef, useEffect} from 'react';
import {Keyboard, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  Container,
  Input,
  Form,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';
import api from '../../services/api';

const Main = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({username: ''});
  const [loading, setLoading] = useState(false);
  const usernameInputRef = useRef();

  useEffect(() => {
    const retrieveData = async () => {
      try {
        if (users.length <= 0) {
          const hasUsers = await AsyncStorage.getItem('@users');
          const value = JSON.parse(hasUsers);
          setUsers(value);
        }
      } catch (error) {
        console.log(error);
      }
    };
    retrieveData();
  });

  useEffect(() => {
    console.tron.log('Entrou!');

    async function storeData() {
      try {
        if (users.length !== 0) {
          await AsyncStorage.setItem('@users', JSON.stringify(users));
        }
      } catch (e) {
        // saving error
      }
    }
    storeData();
  }, [users]);

  const handleAddUser = async () => {
    await setLoading(true);
    const response = await api.get(`/users/${newUser.username}`);

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    setUsers([...users, data]);
    setNewUser([newUser, {username: ''}]);

    usernameInputRef.current.clear();
    Keyboard.dismiss();
    setLoading(false);
  };

  return (
    <Container>
      <Form>
        <Input
          ref={usernameInputRef}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Adicionar Usuário"
          onChangeText={text => setNewUser({username: text})}
          returnKeyType="send"
          onSubmitEditing={() => handleAddUser()}
        />
        <SubmitButton loading={loading} onPress={() => handleAddUser()}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Icon name="add" size={20} color="#fff" />
          )}
        </SubmitButton>
      </Form>

      <List
        data={users}
        keyExtractor={user => user.login}
        renderItem={({item}) => (
          <User>
            <Avatar source={{uri: item.avatar}} />
            <Name>{item.name}</Name>
            <Bio>{item.bio}</Bio>

            <ProfileButton onPress={() => {}}>
              <ProfileButtonText>Ver Perfil</ProfileButtonText>
            </ProfileButton>
          </User>
        )}
      />
    </Container>
  );
};

Main.navigationOptions = {
  title: 'Home',
};

export default Main;
