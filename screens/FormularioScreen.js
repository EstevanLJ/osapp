import * as React from 'react';
import { SafeAreaView, ScrollView, View, Text, Button, StyleSheet, StatusBar, Alert, ActivityIndicator, Modal } from 'react-native';
import FormularioCrud from '../services/FormularioCrud';
import { store } from '../contexts/authStore';
import Api from '../services/api';

import InformacoesGerais from '../components/Form/InformacoesGerais';
import AvaliacaoRiscos from '../components/Form/AvaliacaoRiscos';
import MedidasControle from '../components/Form/MedidasControle';
import ParecerFinal from '../components/Form/ParecerFinal';
import Fotos from '../components/Form/Fotos';

import { dateToString } from '../utils/date';

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f6f7f9',
    paddingBottom: 20
  },
})

const tabs = [
  {
    key: 'informacoesGerais',
    component: InformacoesGerais
  },
  {
    key: 'avaliacaoRiscos',
    component: AvaliacaoRiscos
  },
  {
    key: 'medidasControle',
    component: MedidasControle
  },
  // {
  //   key: 'parecerFinal',
  //   component: ParecerFinal
  // },
  {
    key: 'fotos',
    component: Fotos
  },
]

const initialState = {
  informacoesGerais: {
    data: new Date,
    inicio: new Date,
    termino: new Date,
    atividade: '',
  },
  avaliacaoRiscos: [
    {
      text: 'Exposição às interpéries (sol, chuva, umidade, etc)',
      checked: false
    },
    {
      text: 'Escoriações e queda com diferença de nível',
      checked: false
    },
    {
      text: 'Ruídos de equipamentos (motores, motosseras, etc)',
      checked: false
    },
    {
      text: 'Quedas e projeções de objetos',
      checked: false
    },
    {
      text: 'Exposição a produtos químicos',
      checked: false
    },
    {
      text: 'Acidente de trânsito',
      checked: false
    },
    {
      text: 'Ataque de animais peçonhentos, insetos, vespas, etc',
      checked: false
    },
    {
      text: 'Ataque de cães',
      checked: false
    },
    {
      text: 'Esforço físico',
      checked: false
    },
    {
      text: 'Pouco domínio sobre a atividade',
      checked: false
    },
    {
      text: 'Postura inadequada',
      checked: false
    },
    {
      text: 'Fadiga, cansaço',
      checked: false
    },
    {
      text: 'Eletricidade (arco elétrico, choque elétrico, etc)',
      checked: false
    }
  ],
  medidasControle: [
    {
      text: 'Procedimentos: desligar rede elétrica, sinalizar equipamento desligado, testar ausência de tensão, instalar aterramento temporário, isolar área de trabalho',
      checked: false
    },
    {
      text: 'Uso de equipamentos de proteção individual e coletiva',
      checked: false
    },
    {
      text: 'Uso de ferramental adequado',
      checked: false
    },
    {
      text: 'Excecução de atividades conforme Padrão de Tarefas',
      checked: false
    },
    {
      text: 'Atenção com a postura e no levantamento de pesos',
      checked: false
    },
    {
      text: 'Operação de redes e equipamentos em estrita observância à Ordem de Manobra - OMB',
      checked: false
    },
    {
      text: 'Realizado registro fotográfico do teste de ausência de tensão, aterramento ou cobertura de LV e corda de vida',
      checked: false
    }
  ],
  fotos: [
    {
      text: 'Realização DDS',
      value: null
    },
    {
      text: 'Aterramentos Instalados',
      value: null
    },
    {
      text: 'Sinalizações das Chaves',
      value: null
    },
    {
      text: 'Utilização de Linha de Vida',
      value: null
    },
  ]
}

function FormularioScreen({ navigation }) {

  const { state, dispatch } = React.useContext(store);

  const [showForm, setShowForm] = React.useState(true);
  const [form, setForm] = React.useState({ ...initialState });
  const [loading, setLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('');
  const [currentTab, setCurrentTab] = React.useState(0);

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', async () => {
  //     resetForm();
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  const save = async () => {

    setLoading(true);
    setLoadingMessage('Salvando formulário no dispositivo...')

    try {

      let data = {
        usuario_id: state.userInfo.id,
        device_id: state.deviceId,

        data_local_cadastro: dateToString(new Date()),
        data_atividade: dateToString(form.informacoesGerais.data),
        hora_inicio: dateToString(form.informacoesGerais.inicio),
        hora_fim: dateToString(form.informacoesGerais.termino),
        descricao_atividade: form.informacoesGerais.atividade,
        numero_os: form.informacoesGerais.numero_os,
        avaliacao_riscos: JSON.stringify(form.avaliacaoRiscos),
        medidas_controle: JSON.stringify(form.medidasControle),
        fotos: JSON.stringify(form.fotos),
      }

      let formId = await FormularioCrud.insert(data);

      resetForm();

      Alert.alert(
        'Sucesso!',
        'Seu formulário foi registrado e enviado com sucesso!',
        [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ],
        { cancelable: false }
      );

    } catch (error) {

      console.log(error)

      Alert.alert(
        'Erro!',
        'Houve um erro ao registrar o formulário. Por favor, tente novamente',
        [
          {
            text: 'Ver erro', onPress: () => {
              Alert.alert(
                'Erro',
                JSON.stringify(error),
                [
                  { text: 'Fechar' },
                ],
                { cancelable: false }
              );
            }
          },
          { text: 'OK' },
        ],
        { cancelable: false }
      );

    } finally {
      setLoading(false);
    }
  }

  const onChange = (index, data) => {
    setForm({
      ...form,
      [index]: data
    });
  }

  const next = () => {
    if (currentTab !== tabs.length - 1) {
      setCurrentTab(currentTab + 1);
    }
  }

  const previous = () => {
    if (currentTab !== 0) {
      setCurrentTab(currentTab - 1);
    }
  }

  const resetForm = () => {
    setShowForm(false);
    setForm({
      ...initialState,
      informacoesGerais: {
        data: new Date,
        inicio: new Date,
        termino: new Date,
        atividade: '',
      },
    });
    setCurrentTab(0);

    setTimeout(() => {
      setShowForm(true);
    }, 200);
  }

  const renderForm = () => {
    return (
      <>
        {tabs.map((tab) => {
          let Component = tab.component;

          return <View key={tab.key} style={{ display: tab.key === tabs[currentTab].key ? 'flex' : 'none' }}>
            <Component
              value={form[tab.key]}
              onChange={(data) => onChange(tab.key, data)} />
          </View>
        })}

        {currentTab === tabs.length - 1 ? (
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button title="Voltar" color="#aaa" onPress={() => previous()} />
            <Button title="Salvar" color="#00a28a" onPress={() => save()} />
          </View>
        ) : (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {currentTab === 0 && <Button color="#aaa" title="Cancelar" onPress={() => navigation.navigate('Home')} />}
              {currentTab !== 0 && <Button color="#aaa" title="Voltar" onPress={() => previous()} />}
              {currentTab !== tabs.length - 1 && <Button title="Próximo" onPress={() => next()} />}
            </View>
          )}
      </>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        <StatusBar backgroundColor={'#346cb0'} hidden={false} barStyle="ligh-content" />

        {currentTab === 0 && (
          <Text style={styles.title}>APR - Análise Preliminar de Risco</Text>
        )}

        {!showForm && (
          <View style={{alignItems: 'center'}}>
            <Text>Carregando...</Text>
          </View>
        )}

        {showForm && renderForm()}

      </ScrollView>

      <Modal animation="slide" transparent={true} visible={loading}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <ActivityIndicator size="large" />
          <Text style={{ color: '#fff' }}>{loadingMessage}</Text>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

export default FormularioScreen;