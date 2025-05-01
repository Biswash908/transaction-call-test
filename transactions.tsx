import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';

export default function TransactionsScreen() {
  const [responseBody, setResponseBody] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendPostRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://sandbox.leantech.me/data/v1/transactions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJraWQiOiI2NGY4OWMxNy1lYjVkLTQ1NjMtODBkZS1iYzZmNDE0NzM2MGQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0NTk1ODg5Zi1kNGFiLTQ5MmQtOWU3OS1lZWEzMjk4YTNhNGYiLCJhdWQiOiI0NTk1ODg5Zi1kNGFiLTQ5MmQtOWU3OS1lZWEzMjk4YTNhNGYiLCJuYmYiOjE3NDYxMDE3OTcsInNjb3BlIjpbImN1c3RvbWVyLnJlYWQiLCJjdXN0b21lci53cml0ZSIsInJlZnVuZHMucmVhZCIsImRlc3RpbmF0aW9uLndyaXRlIiwicmVmdW5kcy53cml0ZSIsImJhbmsucmVhZCIsIndlYmhvb2sucmVhZCIsInBheW1lbnQucmVhZCIsImludGVudC53cml0ZSIsImRlc3RpbmF0aW9uLnJlYWQiLCJwYXlvdXQud3JpdGUiLCJkZXBvc2l0LnJlYWQiLCJkYXRhLnJlYWQiLCJwYXlvdXQucmVhZCIsInJlY29uY2lsaWF0aW9uLnJlYWQiXSwiaXNzIjoiaHR0cHM6Ly9hdXRoLnNhbmRib3gubGVhbnRlY2gubWUiLCJleHAiOjE3NDYxMDUzOTcsImlhdCI6MTc0NjEwMTc5NywianRpIjoiOGZhN2EyZTAtMWRmNS00ZmE0LTk3NjQtNTAwOTRhNDc3ZTYwIiwiYXBwbGljYXRpb25zIjpbeyJpZCI6IjQ1OTU4ODlmLWQ0YWItNDkyZC05ZTc5LWVlYTMyOThhM2E0ZiJ9XX0.umQkwgmRMjPyI4JxEVEhm_YsF8tLN5Qbo1efiQmdV4U9XBel3atOQ_b56tOWeNyloQnpJsLn9GO6aGKxyZQh4O4mUVNc-_B6y0MWMPi3LN7Wl5IBRTqqLh6px_zPVBHGA0u4faMiNbk7fNNL0VvZQiVzySubRCWUel6WwN6XJbgu8tThWdytqDKj_kIcV9WyaWs5hyfkWye9_McrNGmDmcrATtN6zlwo03yWFAIwi15Y8UB8mfqUixs9o73mRXoclvnC0KprYxyyga9ZrA8LyFXZ02IhfIS2zO_qznx_iLeVRTPmKZkOgyYeuR1Ycwf0AReUcQy1DhBT2rbfndIriA',
          'Content-Type': 'application/json',
          'Scope': 'api',
        },
        body: JSON.stringify({
          entity_id: '03c57689-a176-4c2d-91db-d90ed7b12c0a',
          account_id: '803fa98d-5765-43e4-ad9f-2732fb8a287c',
        }),
      });

      const data = await response.json();
      setResponseBody(data);
      console.log('Response:', data);
    } catch (error) {
      console.error('Error:', error);
      setResponseBody({ error: 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Send API Request" onPress={sendPostRequest} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {responseBody && (
  <ScrollView style={styles.responseBox}>
    {responseBody.message && <Text style={styles.responseText}>Message: {responseBody.message}</Text>}
    {responseBody.payload && responseBody.payload.transactions && (
      <View>
        {responseBody.payload.transactions.map((transaction, index) => (
          <Text key={index} style={styles.responseText}>{JSON.stringify(transaction, null, 2)}</Text>
        ))}
      </View>
    )}
  </ScrollView>
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  responseBox: {
    marginTop: 20,
    maxHeight: 300,
  },
  responseText: {
    fontFamily: 'monospace',
    color: 'white'
  },
});
