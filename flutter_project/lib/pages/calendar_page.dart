import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/garden_state.dart';
import '../models/plant_models.dart';

class CalendarPage extends StatefulWidget {
  const CalendarPage({super.key});

  @override
  State<CalendarPage> createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> {
  String calendarMode = 'care'; // 'care' or 'nepalese'
  int selectedDay = 15; // Simulated June 15, 2026

  final List<String> monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  @override
  Widget build(BuildContext context) {
    final state = Provider.of<GardenState>(context);

    // Filter plants needing watering or feeding on selected day in June
    final waterPlants = state.plants.where((p) {
      if (p.lastWateredDate == null) return true;
      final int lastWaterDay = int.parse(p.lastWateredDate!.split('-')[2]);
      final elapsed = selectedDay - lastWaterDay;
      return elapsed >= p.wateringIntervalDays;
    }).toList();

    final feedPlants = state.plants.where((p) {
      if (p.lastFertilizedDate == null) return false;
      final int lastFeedDay = int.parse(p.lastFertilizedDate!.split('-')[2]);
      final elapsed = selectedDay - lastFeedDay;
      return elapsed >= p.fertilizerIntervalDays;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Care Scheduler',
          style: GoogleFonts.spaceGrotesk(fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Mode Select Toggle Buttons
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surfaceContainer,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () => setState(() => calendarMode = 'care'),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: calendarMode == 'care'
                              ? Theme.of(context).colorScheme.primary
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'Care Routine',
                          style: GoogleFonts.spaceGrotesk(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: calendarMode == 'care'
                                ? Theme.of(context).colorScheme.onPrimary
                                : Theme.of(context).colorScheme.onSurface,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: InkWell(
                      onTap: () => setState(() => calendarMode = 'nepalese'),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: calendarMode == 'nepalese'
                              ? Theme.of(context).colorScheme.primary
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'Nepalese Patro',
                          style: GoogleFonts.spaceGrotesk(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: calendarMode == 'nepalese'
                                ? Theme.of(context).colorScheme.onPrimary
                                : Theme.of(context).colorScheme.onSurface,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            if (calendarMode == 'care') ...[
              // Standard Calendar Grid (Mock representation for June 2026)
              Card(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24),
                  side: BorderSide(color: Theme.of(context).colorScheme.outlineVariant.withOpacity(0.4)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          Text(
                            'June 2026',
                            style: GoogleFonts.spaceGrotesk(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          TextButton(
                            onPressed: () => setState(() => selectedDay = 15),
                            child: const Text('Go to Today'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      // Weekday Headers
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) {
                          return SizedBox(
                            width: 32,
                            child: Center(
                              child: Text(
                                day,
                                style: GoogleFonts.inter(fontWeight: FontWeight.black, fontSize: 10, color: Colors.grey),
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                      const Divider(height: 16),
                      // Days grid
                      GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 7,
                          crossAxisSpacing: 4,
                          mainAxisSpacing: 4,
                        ),
                        itemCount: 30, // June has 30 days
                        itemBuilder: (ctx, index) {
                          final dayNum = index + 1;
                          final isSelected = selectedDay == dayNum;
                          final isToday = dayNum == 15;

                          return InkWell(
                            onTap: () => setState(() => selectedDay = dayNum),
                            borderRadius: BorderRadius.circular(10),
                            child: Container(
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? Theme.of(context).colorScheme.primary
                                    : isToday
                                        ? Theme.of(context).colorScheme.primaryContainer.withOpacity(0.4)
                                        : Colors.transparent,
                                borderRadius: BorderRadius.circular(10),
                                border: isToday
                                    ? Border.all(color: Theme.of(context).colorScheme.primary, width: 1.5)
                                    : null,
                              ),
                              child: Center(
                                child: Text(
                                  '$dayNum',
                                  style: GoogleFonts.inter(
                                    fontWeight: isSelected || isToday ? FontWeight.bold : FontWeight.normal,
                                    fontSize: 12,
                                    color: isSelected
                                        ? Theme.of(context).colorScheme.onPrimary
                                        : Theme.of(context).colorScheme.onSurface,
                                  ),
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ] else ...[
              // Nepalese B.S. Patro View
              Card(
                elevation: 0,
                color: Colors.green.shade50.withOpacity(0.5),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24),
                  side: BorderSide(color: Colors.green.shade100),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Nepalese Patro (नेपाली पात्रो)',
                                  style: GoogleFonts.spaceGrotesk(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.green.shade900,
                                  ),
                                ),
                                Text(
                                  'Tradition and lunar tracking for optimal planting seasons',
                                  style: GoogleFonts.inter(fontSize: 11, color: Colors.green.shade800),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // Mock Iframe fallback visualization
                      Container(
                        height: 200,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: Colors.green.shade100.withOpacity(0.5),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.language, size: 36, color: Colors.green),
                            const SizedBox(height: 8),
                            Text(
                              'Traditional B.S. Bikram Sambat Live Widget',
                              style: GoogleFonts.spaceGrotesk(fontSize: 12, fontWeight: FontWeight.bold),
                              textAlign: TextAlign.center,
                            ),
                            Text(
                              'Loads calendar.php?title_color=2e7d32 dynamically',
                              style: GoogleFonts.inter(fontSize: 10, color: Colors.grey.shade700),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 14),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.info_outline, size: 16, color: Colors.green),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'Nepal traditional planting leveraged via lunar Days (Tithis), lunar transitions and Bikram Sambat shifts. Use this mode to synchronize propagation, seeding and harvesting cycles.',
                              style: GoogleFonts.inter(fontSize: 11, height: 1.5),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Horizontal Nepali day strip calendar
              Text(
                'B.S. Patro Day Explorer / गते चयन गर्नुहोस्',
                style: GoogleFonts.spaceGrotesk(fontSize: 14, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              SizedBox(
                height: 64,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: 30,
                  itemBuilder: (ctx, index) {
                    final nepaliDayNum = index + 1;
                    final isSelected = selectedDay == nepaliDayNum;
                    final nepaliDigits = ['०','१','२','३','४','५','६','७','८','९'];
                    final String nepNumStr = String.value(nepaliDayNum).split('').map((ch) => nepaliDigits[int.parse(ch)]).join('');

                    return InkWell(
                      onTap: () => setState(() => selectedDay = nepaliDayNum),
                      child: Container(
                        width: 58,
                        margin: const EdgeInsets.only(right: 8),
                        decoration: BoxDecoration(
                          color: isSelected ? Colors.green : Theme.of(context).colorScheme.surfaceContainerHigh,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.green.withOpacity(0.2)),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              nepNumStr,
                              style: GoogleFonts.spaceGrotesk(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: isSelected ? Colors.white : Colors.black80,
                              ),
                            ),
                            Text(
                              'June $nepaliDayNum',
                              style: GoogleFonts.inter(
                                fontSize: 9,
                                color: isSelected ? Colors.white70 : Colors.black54,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
            const SizedBox(height: 24),

            // Select Day Agenda details panel
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surfaceContainerLow,
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Text(
                        'Agenda for ${monthNames[5]} $selectedDay',
                        style: GoogleFonts.spaceGrotesk(fontSize: 15, fontWeight: FontWeight.bold),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, py: 4),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.primaryContainer,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          '${waterPlants.length + feedPlants.length} Due',
                          style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.primary),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Watering Required
                  Text(
                    '💧 Watering Needed (${waterPlants.length})',
                    style: GoogleFonts.spaceGrotesk(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.blue.shade700),
                  ),
                  const SizedBox(height: 8),
                  if (waterPlants.isEmpty)
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text('No water scheduled 🌿', style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
                    )
                  else
                    ...waterPlants.map((p) => ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: CircleAvatar(backgroundImage: NetworkImage(p.image), radius: 18),
                          title: Text(p.name, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold)),
                          subtitle: Text('Every ${p.wateringIntervalDays} days', style: GoogleFonts.inter(fontSize: 10)),
                          trailing: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue.shade50,
                              foregroundColor: Colors.blue.shade800,
                              elevation: 0,
                              minimumSize: const Size(60, 32),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            onPressed: () {
                              state.recordWatering(p.id, DateTime.now());
                              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('💦 Watered ${p.name}!')));
                            },
                            child: const Text('Water', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                          ),
                        )),

                  const Divider(height: 24),

                  // Feeding Required
                  Text(
                    '✨ Nourishment Needed (${feedPlants.length})',
                    style: GoogleFonts.spaceGrotesk(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.amber.shade700),
                  ),
                  const SizedBox(height: 8),
                  if (feedPlants.isEmpty)
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text('No feeding scheduled ✨', style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
                    )
                  else
                    ...feedPlants.map((p) => ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: CircleAvatar(backgroundImage: NetworkImage(p.image), radius: 18),
                          title: Text(p.name, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold)),
                          subtitle: Text('Every ${p.fertilizerIntervalDays} days', style: GoogleFonts.inter(fontSize: 10)),
                          trailing: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.amber.shade50,
                              foregroundColor: Colors.amber.shade800,
                              elevation: 0,
                              minimumSize: const Size(60, 32),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            onPressed: () {
                              state.recordFertilization(p.id, DateTime.now());
                              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('✨ Fertilized ${p.name}!')));
                            },
                            child: const Text('Feed', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                          ),
                        )),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
extension on String {
  static String value(int val) => val.toString();
}
