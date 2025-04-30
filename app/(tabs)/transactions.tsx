import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import axios from 'axios';

// Transaction type model
type Transaction = {
  description: string;
  amount: number;
};

// Summary totals
type Summary = {
  spent: number;
  credited: number;
  remaining: number;
};

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);

  const fetchTransactions = async () => {
    try {
      const response = await axios.post(
        'https://sandbox.leantech.me/data/v1/transactions',
        {
          entity_id: '03c57689-a176-4c2d-91db-d90ed7b12c0a', // Replace with your own
          account_id: '803fa98d-5765-43e4-ad9f-2732fb8a287c', // Current account ID
        },
        {
          headers: {
            Authorization: 'Bearer eyJraWQiOiJhNDNhMjFlOS0zNWVhLTRlOTQtOGZhMC1hNDQ5YTg1MjM4MmMiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0NTk1ODg5Zi1kNGFiLTQ5MmQtOWU3OS1lZWEzMjk4YTNhNGYiLCJhdWQiOiI0NTk1ODg5Zi1kNGFiLTQ5MmQtOWU3OS1lZWEzMjk4YTNhNGYiLCJuYmYiOjE3NDYwMzgwODcsInNjb3BlIjpbImN1c3RvbWVyLnJlYWQiLCJjdXN0b21lci53cml0ZSIsInJlZnVuZHMucmVhZCIsImRlc3RpbmF0aW9uLndyaXRlIiwicmVmdW5kcy53cml0ZSIsImJhbmsucmVhZCIsIndlYmhvb2sucmVhZCIsInBheW1lbnQucmVhZCIsImludGVudC53cml0ZSIsImRlc3RpbmF0aW9uLnJlYWQiLCJwYXlvdXQud3JpdGUiLCJkZXBvc2l0LnJlYWQiLCJkYXRhLnJlYWQiLCJwYXlvdXQucmVhZCIsInJlY29uY2lsaWF0aW9uLnJlYWQiXSwiaXNzIjoiaHR0cHM6Ly9hdXRoLnNhbmRib3gubGVhbnRlY2gubWUiLCJleHAiOjE3NDYwNDE2ODcsImlhdCI6MTc0NjAzODA4NywianRpIjoiNDE2MWYzNTQtODc5Yi00ODFjLWFjMDgtYmJjYzZiOTllYzkxIiwiYXBwbGljYXRpb25zIjpbeyJpZCI6IjQ1OTU4ODlmLWQ0YWItNDkyZC05ZTc5LWVlYTMyOThhM2E0ZiJ9XX0.FbufiS00sC-3ZyP3g_OC_f-8DmW-Miq424hjwh3y4wgpHkiyy47PHkkbyjuG7HPRnnIpJBxZkrpBhVv1sXFmqMxrx0MQRS4TwKzRBjSzYLo5AR_z7ozZDp5zpnA4F46fm_z1B5mukUf6q_1-3yiXhT30m3pQZI0lg5m7IeIJe-uHHg4aGzI-T0fTm4oy4HrPO47IN1YULPgfH9kU5YwAhHYmvOE-NaWa4x8Ltmb53kqvyibwoWK5vhYhvYPZzBc4-lWiSlD4h9cGI9ZJbGWKtB27yA_dtiWQDEcm3Srzt86htP1Zn6VBa4zUeL4MP89Ew5X_b1szRRoomJw_YPYSAQ', // Replace with your customer-scoped access token
            'Content-Type': 'application/json',
          },
        }
      );

      const txns: Transaction[] = response.data.payload.transactions;

      let spent = 0;
      let credited = 0;

      // Loop through each transaction and categorize into spent/credited
      txns.forEach((t) => {
        if (t.amount > 0) credited += t.amount;
        else spent += Math.abs(t.amount);
      });

      setTransactions(txns);
      setSummary({ spent, credited, remaining: credited - spent });
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Button title="Fetch Transactions" onPress={fetchTransactions} />
      {summary && (
        <View style={{ marginTop: 20 }}>
          <Text>Spent: AED {summary.spent.toFixed(2)}</Text>
          <Text>Credited: AED {summary.credited.toFixed(2)}</Text>
          <Text>Remaining: AED {summary.remaining.toFixed(2)}</Text>
        </View>
      )}
      {transactions.map((txn, index) => (
        <Text key={index}>
          {txn.description}: AED {txn.amount}
        </Text>
      ))}
    </ScrollView>
  );
}
