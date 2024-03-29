import React, {useState, useRef, useEffect} from 'react';
import {Keyboard, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconTrash from 'react-native-vector-icons/MaterialCommunityIcons';

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
  ClearButton,
} from './styles';
import api from '../../services/api';

const Main = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({username: ''});
  const [loading, setLoading] = useState(false);
  const usernameInputRef = useRef();

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('@users');
        if (value !== null) {
          setUsers(JSON.parse(value));
        }
      } catch (e) {}
    };
    retrieveData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        if (users.length != 0) {
          await AsyncStorage.setItem('@users', JSON.stringify(users));
        }
      } catch (e) {}
    };
    saveData();
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
    setLoading(false);

    setNewUser([newUser, {username: ''}]);
    usernameInputRef.current.clear();

    Keyboard.dismiss();
  };

  const handleClearList = async () => {
    await AsyncStorage.setItem('@users', JSON.stringify([]));
    setUsers([]);
  };

  const handleNavigation = user => {
    navigation.navigate('User', {user});
  };

  return (
    <Container>
      <Form>
        <Input
          ref={usernameInputRef}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Adicionar Usuário"
          onChangeText={text => setNewUser({username: text})}
          returnKeyType="send"
          onSubmitEditing={() => handleAddUser()}
        />
        <SubmitButton loading={loading} onPress={() => handleAddUser()}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Icon name="add" size={20} color="#fff" />
          )}
        </SubmitButton>
        {users.length > 0 && (
          <ClearButton onPress={() => handleClearList()}>
            <Icon name="refresh" size={20} color="#ed4f3f" />
          </ClearButton>
        )}
      </Form>

      <List
        data={users}
        keyExtractor={user => user.login}
        renderItem={({item}) => (
          <User>
            <Avatar source={{uri: item.avatar}} />
            <Name>{item.name}</Name>
            <Bio>{item.bio}</Bio>

            <ProfileButton
              onPress={() => {
                handleNavigation(item);
              }}>
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
