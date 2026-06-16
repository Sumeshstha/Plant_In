import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/garden_state.dart';
import '../models/plant_models.dart';

class GardenPage extends StatefulWidget {
  const GardenPage({super.key});

  @override
  State<GardenPage> createState() => _GardenPageState();
}

class _GardenPageState extends State<GardenPage> {
  String selectedFilter = 'All';

  @override
  Widget build(BuildContext context) {
    final state = Provider.of<GardenState>(context);
    
    // Filter plants locally
    final filteredPlants = state.plants.where((p) {
      if (selectedFilter == 'All') return true;
      if (selectedFilter == 'Indoor') return p.habitat == 'Indoor';
      if (selectedFilter == 'Outdoor') return p.habitat == 'Outdoor';
      if (selectedFilter == 'Needs Attention') return p.healthStatus == 'Needs Attention';
      return true;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'My Garden',
          style: GoogleFonts.spaceGrotesk(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              // Trigger simple automatic plant generation mock
              state.addPlant(Plant(
                id: 'p-${DateTime.now().millisecondsSinceEpoch}',
                name: 'Neon Pothos',
                scientificName: 'Epipremnum aureum',
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1000',
                description: 'Bright electric neon green heart-shaped foliage.',
                vitality: 100,
                healthStatus: 'Excellent',
                light: 'Bright Indirect Light',
                watering: 'Every 7 Days',
                temp: '18-25°C',
                habitat: 'Indoor',
                tags: [],
                spaceId: 's1',
                journals: [],
                wateringIntervalDays: 7,
                fertilizerIntervalDays: 14,
                repotIntervalMonths: 12,
              ));
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('🌱 Added "Neon Pothos" to My Garden!')),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          // Horizontal Pill Filters
          Container(
            height: 52,
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: ['All', 'Indoor', 'Outdoor', 'Needs Attention'].map((filter) {
                final isSelected = selectedFilter == filter;
                return Container(
                  margin: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(
                      filter,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isSelected
                            ? Theme.of(context).colorScheme.onPrimary
                            : Theme.of(context).colorScheme.onSurface,
                      ),
                    ),
                    selected: isSelected,
                    selectedColor: Theme.of(context).colorScheme.primary,
                    backgroundColor: Theme.of(context).colorScheme.surfaceContainer,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    onSelected: (selected) {
                      if (selected) {
                        setState(() {
                          selectedFilter = filter;
                        });
                      }
                    },
                  ),
                );
              }).toList(),
            ),
          ),

          // Plants List Grid
          Expanded(
            child: filteredPlants.isEmpty
                ? Center(
                    child: Text(
                      'No matching plants found in garden 🌿',
                      style: GoogleFonts.inter(fontSize: 14, fontStyle: FontStyle.italic),
                    ),
                  )
                : GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 14,
                      mainAxisSpacing: 14,
                      childAspectRatio: 0.72,
                    ),
                    itemCount: filteredPlants.length,
                    itemBuilder: (ctx, i) {
                      final p = filteredPlants[i];
                      return Card(
                        clipBehavior: Clip.antiAlias,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                          side: BorderSide(
                            color: Theme.of(context).colorScheme.outlineVariant.withOpacity(0.4),
                          ),
                        ),
                        elevation: 0,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Plant Image
                            Expanded(
                              flex: 5,
                              child: Stack(
                                children: [
                                  Image.network(
                                    p.image,
                                    width: double.infinity,
                                    fit: BoxFit.cover,
                                  ),
                                  // Health Status Badge
                                  Positioned(
                                    top: 10,
                                    left: 10,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, py: 4),
                                      decoration: BoxDecoration(
                                        color: p.healthStatus == 'Needs Attention'
                                            ? Colors.red.shade50
                                            : Colors.green.shade50,
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        p.healthStatus,
                                        style: GoogleFonts.inter(
                                          fontSize: 9,
                                          fontWeight: FontWeight.bold,
                                          color: p.healthStatus == 'Needs Attention'
                                              ? Colors.red.shade800
                                              : Colors.green.shade800,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            // Plant Info
                            Expanded(
                              flex: 4,
                              child: Padding(
                                padding: const EdgeInsets.all(10.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      p.name,
                                      style: GoogleFonts.spaceGrotesk(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    Text(
                                      p.scientificName,
                                      style: GoogleFonts.inter(
                                        fontSize: 11,
                                        fontStyle: FontStyle.italic,
                                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const Spacer(),
                                    // Vitality Meter
                                    Row(
                                      children: [
                                        Expanded(
                                          child: LinearProgressIndicator(
                                            value: p.vitality / 100,
                                            backgroundColor: Colors.grey.shade200,
                                            valueColor: AlwaysStoppedAnimation<Color>(
                                              p.vitality < 70 ? Colors.amber : Colors.green,
                                            ),
                                            minHeight: 4,
                                            borderRadius: BorderRadius.circular(4),
                                          ),
                                        ),
                                        const SizedBox(width: 6),
                                        Text(
                                          '${p.vitality}%',
                                          style: GoogleFonts.inter(
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 6),
                                    // Care Action Controls
                                    Row(
                                      children: [
                                        Expanded(
                                          child: InkWell(
                                            onTap: () {
                                              state.recordWatering(p.id, DateTime.now());
                                              ScaffoldMessenger.of(context).showSnackBar(
                                                SnackBar(content: Text('💦 Watered "${p.name}"! Vitality restored.')),
                                              );
                                            },
                                            child: Container(
                                              padding: const EdgeInsets.symmetric(vertical: 6),
                                              alignment: Alignment.center,
                                              decoration: BoxDecoration(
                                                color: Colors.blue.shade50,
                                                borderRadius: BorderRadius.circular(10),
                                              ),
                                              child: Text(
                                                'Water',
                                                style: GoogleFonts.inter(
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 10,
                                                  color: Colors.blue.shade800,
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 6),
                                        Expanded(
                                          child: InkWell(
                                            onTap: () {
                                              state.recordFertilization(p.id, DateTime.now());
                                              ScaffoldMessenger.of(context).showSnackBar(
                                                SnackBar(content: Text('✨ Fertilized "${p.name}"! Nutrients supplied.')),
                                              );
                                            },
                                            child: Container(
                                              padding: const EdgeInsets.symmetric(vertical: 6),
                                              alignment: Alignment.center,
                                              decoration: BoxDecoration(
                                                color: Colors.amber.shade50,
                                                borderRadius: BorderRadius.circular(10),
                                              ),
                                              child: Text(
                                                'Feed',
                                                style: GoogleFonts.inter(
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 10,
                                                  color: Colors.amber.shade800,
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
