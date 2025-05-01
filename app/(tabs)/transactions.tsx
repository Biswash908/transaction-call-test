import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput
} from 'react-native';

export default function TransactionsScreen() {
  const [categorized, setCategorized] = useState(null);
  const [selectedMain, setSelectedMain] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({ income: 0, expense: 0 });
  const [filteredTotals, setFilteredTotals] = useState({ income: 0, expense: 0 });
  const [filterDate, setFilterDate] = useState('');


  const sendPostRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://sandbox.leantech.me/data/v1/transactions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJraWQiOiI2NGY4OWMxNy1lYjVkLTQ1NjMtODBkZS1iYzZmNDE0NzM2MGQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0NTk1ODg5Zi1kNGFiLTQ5MmQtOWU3OS1lZWEzMjk4YTNhNGYiLCJhdWQiOiI0NTk1ODg5Zi1kNGFiLTQ5MmQtOWU3OS1lZWEzMjk4YTNhNGYiLCJuYmYiOjE3NDYxMTI0MTYsInNjb3BlIjpbImN1c3RvbWVyLnJlYWQiLCJjdXN0b21lci53cml0ZSIsInJlZnVuZHMucmVhZCIsImRlc3RpbmF0aW9uLndyaXRlIiwicmVmdW5kcy53cml0ZSIsImJhbmsucmVhZCIsIndlYmhvb2sucmVhZCIsInBheW1lbnQucmVhZCIsImludGVudC53cml0ZSIsImRlc3RpbmF0aW9uLnJlYWQiLCJwYXlvdXQud3JpdGUiLCJkZXBvc2l0LnJlYWQiLCJkYXRhLnJlYWQiLCJwYXlvdXQucmVhZCIsInJlY29uY2lsaWF0aW9uLnJlYWQiXSwiaXNzIjoiaHR0cHM6Ly9hdXRoLnNhbmRib3gubGVhbnRlY2gubWUiLCJleHAiOjE3NDYxMTYwMTYsImlhdCI6MTc0NjExMjQxNiwianRpIjoiZDhmMzg1MDQtNmM3Yy00NDJjLTg3ZGQtMGRmMzhlZjM2OWVkIiwiYXBwbGljYXRpb25zIjpbeyJpZCI6IjQ1OTU4ODlmLWQ0YWItNDkyZC05ZTc5LWVlYTMyOThhM2E0ZiJ9XX0.8xZgNy_Ec8BWpdHv8jVqQ49a9gMAOa9xcNoISrVKtMJQ2Gngc7h9BW_-_zflcP22GxlT7YrDdpgqar5Tav_zSq2MedgTEcq6j8eLzzQ-IaEQlIovvMSOLyfz06uQd5VH8QRaAFIpaqrjB8BYaWGRpIx3_ubOoUdzXNY6GGGSCGbHoW4AbD9fWvpgErI_SY1IYkED_hBE7uz5y001CBcsjExgYpjDAM9yjcbm8tf54QBUs1peI5kZiZo3oZFrTDAu1Iov9ScQNnk8W0Ht24VBijOwyHecAZX5Es2LDO1gOaUYp8EgdfjjwwyoZ_qc3M-7WKusN7wP2we2Ei1pbdy-CQ',
          'Content-Type': 'application/json',
          'Scope': 'api',
        },
        body: JSON.stringify({
          entity_id: '03c57689-a176-4c2d-91db-d90ed7b12c0a',
          account_id: '803fa98d-5765-43e4-ad9f-2732fb8a287c',
        }),
      });

      const json = await response.json();
      const categorized = categorizeTransactions(json.payload.transactions);
      setCategorized(categorized);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const categorizeTransactions = (transactions) => {
    const categorized = {
      income: [],
      expense: {
        groceries: [],
        dining: [],
        utilities: [],
        entertainment: [],
        shopping: [],
        health_education: [],
        transport: [],
        charity: [],
        rent_services: [],
        other: []
      }
    };
  
    let totalIncome = 0;
    let totalExpense = 0;
    let filteredIncome = 0;
    let filteredExpense = 0;
  
    const matchesFilter = (dateStr) => {
      if (!filterDate) return true;
      const [month, year] = filterDate.split('/');
      const txnDate = new Date(dateStr);
      return txnDate.getMonth() + 1 === parseInt(month) && txnDate.getFullYear() === parseInt(year);
    };
  
    transactions.forEach(txn => {
      const desc = txn.description.toLowerCase();
      const amt = txn.amount;
      const isInMonth = matchesFilter(txn.date);
  
      if (amt > 0) {
        categorized.income.push(txn);
        totalIncome += amt;
        if (isInMonth) filteredIncome += amt;
      } else {
        const match = (keywords) => keywords.some(k => desc.includes(k));
  
        if (match(["carrefour", "madina", "hypermarket", "7-eleven", "lulu"])) {
          categorized.expense.groceries.push(txn);
        } else if (match(["restaurant", "sushi", "zomato", "noodle", "caribou", "starbucks", "bento", "subway", "zaater"])) {
          categorized.expense.dining.push(txn);
        } else if (match(["etisalat", "gov", "vat", "utility", "smart"])) {
          categorized.expense.utilities.push(txn);
        } else if (match(["netflix", "cinema", "cine", "playstation", "uber", "facebk"])) {
          categorized.expense.entertainment.push(txn);
        } else if (match(["amazon", "zara", "nike", "under armour", "uniqlo", "top shop", "body shop"])) {
          categorized.expense.shopping.push(txn);
        } else if (match(["school", "university", "nursery", "prometric", "education"])) {
          categorized.expense.health_education.push(txn);
        } else if (match(["atm", "swansea", "esso", "petrol", "transport", "convenience"])) {
          categorized.expense.transport.push(txn);
        } else if (match(["yalla", "zakat", "charity", "romanian"])) {
          categorized.expense.charity.push(txn);
        } else if (match(["rent", "installment", "stcpay", "development authority"])) {
          categorized.expense.rent_services.push(txn);
        } else {
          categorized.expense.other.push(txn);
        }
  
        totalExpense += Math.abs(amt);
        if (isInMonth) filteredExpense += Math.abs(amt);
      }
    });
  
    setTotals({ income: totalIncome, expense: totalExpense });
    setFilteredTotals({ income: filteredIncome, expense: filteredExpense });
  
    return categorized;
  };  

  const renderTransactions = (transactions) => (
    <ScrollView
  style={styles.scrollBox}
  nestedScrollEnabled={true}
  keyboardShouldPersistTaps="handled"
>
      {transactions.map((txn, idx) => (
        <Text key={idx} style={styles.transactionText}>{txn.description} - {txn.amount}</Text>
      ))}
    </ScrollView>
  );

  return (
    <ScrollView
  style={{ flex: 1 }}
  contentContainerStyle={styles.container}
  keyboardShouldPersistTaps="handled"
>
      <TouchableOpacity style={styles.button} onPress={sendPostRequest}>
        <Text style={styles.buttonText}>Fetch Transactions</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 20 }}>
  <Text>All-time Income: {totals.income.toFixed(2)}</Text>
  <Text>All-time Expenses: {totals.expense.toFixed(2)}</Text>

  <TextInput
    placeholder="MM/YYYY"
    style={{
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      borderRadius: 6,
      marginTop: 10,
    }}
    value={filterDate}
    onChangeText={(text) => setFilterDate(text)}
    onEndEditing={() => {
      if (categorized) {
        const updated = categorizeTransactions(
          [...categorized.income, ...Object.values(categorized.expense).flat()]
        );
        setCategorized(updated);
      }
    }}
  />
  <Text style={{ marginTop: 5 }}>Filtered Income: {filteredTotals.income.toFixed(2)}</Text>
  <Text>Filtered Expenses: {filteredTotals.expense.toFixed(2)}</Text>
</View>

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

      {categorized && (
        <>
          <TouchableOpacity
            style={styles.categoryHeader}
            onPress={() => {
              setSelectedMain(selectedMain === 'income' ? null : 'income');
              setSelectedSub(null);
            }}
          >
            <Text style={styles.categoryText}>INCOME ({categorized.income.length})</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryHeader}
            onPress={() => {
              setSelectedMain(selectedMain === 'expense' ? null : 'expense');
              setSelectedSub(null);
            }}
          >
            <Text style={styles.categoryText}>EXPENSES</Text>
          </TouchableOpacity>

          {selectedMain === 'expense' && (
            Object.entries(categorized.expense).map(([sub, txns]) => (
              <TouchableOpacity
                key={sub}
                style={styles.subCategoryHeader}
                onPress={() => setSelectedSub(selectedSub === sub ? null : sub)}
              >
                <Text style={styles.subCategoryText}>{sub.replace('_', ' ').toUpperCase()} ({txns.length})</Text>
              </TouchableOpacity>
            ))
          )}

          <View style={styles.box}>
            {selectedMain === 'income' && renderTransactions(categorized.income)}
            {selectedMain === 'expense' && selectedSub && renderTransactions(categorized.expense[selectedSub])}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  categoryHeader: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  categoryText: {
    fontWeight: 'bold',
  },
  subCategoryHeader: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    paddingLeft: 20,
    borderRadius: 6,
    marginTop: 5,
  },
  subCategoryText: {
    fontSize: 13,
  },
  box: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginTop: 15,
    maxHeight: 300, // Or any fixed px height you prefer
    overflow: 'hidden',
  },
  scrollBox: {
    padding: 10,
  },  
  transactionText: {
    fontSize: 12,
    paddingVertical: 2,
    fontFamily: 'monospace',
  },
  container: {
    backgroundColor: '#ffffff',
    padding: 20,
    paddingBottom: 50,
  },  
});
