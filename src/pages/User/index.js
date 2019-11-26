import React, {useState, useEffect} from 'react';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnedAvatar,
  Info,
  Title,
  Author,
  LoadingIndicator,
} from './styles';
import api from '../../services/api';

const User = ({navigation}) => {
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = navigation.getParam('user');

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      const response = await api.get(`/users/${user.login}/starred`);
      setStars(response.data);

      setLoading(false);
    };
    getData();
  }, [user.login]);

  return (
    <Container>
      <Header>
        <Avatar source={{uri: user.avatar}} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>

      {loading ? (
        <LoadingIndicator />
      ) : (
        <Stars
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({item}) => (
            <Starred>
              <OwnedAvatar source={{uri: item.owner.avatar_url}} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
      )}
    </Container>
  );
};

User.navigationOptions = ({navigation}) => ({
  title: navigation.getParam('user').name,
});

export default User;
