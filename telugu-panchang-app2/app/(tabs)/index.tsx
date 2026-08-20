import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type InfoCardProps = {
  label: string;
  value: string;
  icon: string;
  accent: string;
  fullWidth?: boolean;
};

function InfoCard({
  label,
  value,
  icon,
  accent,
  fullWidth = false,
}: InfoCardProps) {
  return (
    <View
      style={[
        styles.card,
        fullWidth ? styles.fullWidthCard : styles.halfWidthCard,
      ]}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: accent + '18' },
        ]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
    </View>
  );
}

function HomeScreen() {
  const today = new Date();

  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7EED7" />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🕉️ తెలుగు పంచాంగం</Text>
          <Text style={styles.subtitle}>Today • {formattedDate}</Text>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>శుభోదయం</Text>
          <Text style={styles.heroText}>
            ఈ రోజు మీకు శాంతి, శ్రేయస్సు మరియు ఆశీస్సులు కలుగాలని ఆశిస్తున్నాం.
          </Text>
        </View>

        <View style={styles.cardsWrap}>
          <InfoCard
            label="తిథి"
            value="పంచమి"
            icon="🌙"
            accent="#8B0000"
          />
          <InfoCard
            label="నక్షత్రం"
            value="ఉత్తరాషాఢం"
            icon="⭐"
            accent="#C96A00"
          />
          <InfoCard
            label="రాహుకాలం"
            value="11:30 - 01:00"
            icon="⏰"
            accent="#7C3AED"
          />
          <InfoCard
            label="యమగండం"
            value="08:30 - 10:00"
            icon="🪔"
            accent="#0F766E"
          />
          <InfoCard
            label="సూర్యోదయం"
            value="05:48 AM"
            icon="☀️"
            accent="#D97706"
          />
          <InfoCard
            label="సూర్యాస్తమయం"
            value="06:42 PM"
            icon="🌇"
            accent="#2563EB"
          />
          <InfoCard
            label="ఈ రోజు శ్లోకం"
            value="కర్మణ్యేవాధికారస్తే మా ఫలేషు కదాచన"
            icon="📖"
            accent="#A16207"
            fullWidth
          />
          <InfoCard
            label="ఈ రోజు పర్వదినం"
            value="శ్రీ కృష్ణ జన్మాష్టమి"
            icon="🎉"
            accent="#B91C1C"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7EED7',
  },
  container: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#8B0000',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#8A6D3B',
    fontWeight: '600',
  },
  heroCard: {
    backgroundColor: '#FFFDF7',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EFE1B7',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#8B0000',
    marginBottom: 6,
  },
  heroText: {
    fontSize: 14,
    color: '#6B4F3A',
    lineHeight: 20,
  },
  cardsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F2E8CB',
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  halfWidthCard: {
    width: '48%',
  },
  fullWidthCard: {
    width: '100%',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconText: {
    fontSize: 18,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    color: '#8A6D3B',
    fontWeight: '700',
    marginBottom: 3,
  },
  cardValue: {
    fontSize: 14,
    color: '#222',
    fontWeight: '700',
    flexShrink: 1,
  },
});