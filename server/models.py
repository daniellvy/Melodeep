# 
# Copyright 2016 Google Inc.
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
# http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# 


import magenta
import magenta.music as mm

from magenta.models.melody_rnn import melody_rnn_config_flags
from magenta.models.melody_rnn import melody_rnn_model
from magenta.models.melody_rnn import melody_rnn_sequence_generator
from magenta.protobuf import generator_pb2
from magenta.protobuf import music_pb2

basic_rnn = None
lookback_rnn = None
attention_rnn = None


def initialize():
    bundle = mm.sequence_generator_bundle.read_bundle_file('basic_rnn.mag')
    generator_map = melody_rnn_sequence_generator.get_generator_map()
    basic_rnn = generator_map['basic_rnn'](checkpoint=None, bundle=bundle)
    basic_rnn.initialize()

    bundle = mm.sequence_generator_bundle.read_bundle_file('lookback_rnn.mag')
    generator_map = melody_rnn_sequence_generator.get_generator_map()
    lookback_rnn = generator_map['lookback_rnn'](checkpoint=None, bundle=bundle)
    lookback_rnn.initialize()

    bundle = mm.sequence_generator_bundle.read_bundle_file('attention_rnn.mag')
    generator_map = melody_rnn_sequence_generator.get_generator_map()
    attention_rnn = generator_map['attention_rnn'](checkpoint=None, bundle=bundle)
    attention_rnn.initialize()


def generate(primer_sequence, num_steps=20, temperature=1.0, model='basic_rnn'):
    melody_rnn = basic_rnn
    if model == "basic_rnn":
        melody_rnn = basic_rnn

    # Set the start time to begin on the next step after the last note ends.
    last_end_time = (max(n.end_time for n in primer_sequence.notes)
                     if primer_sequence.notes else 0)
    # predict the tempo
    if len(primer_sequence.notes) > 4:
        estimated_tempo = midi_data.estimate_tempo()
        if estimated_tempo > 240:
            qpm = estimated_tempo / 2
        else:
            qpm = estimated_tempo
    else:
        qpm = 120
    primer_sequence.tempos[0].qpm = qpm

    qpm = primer_sequence.tempos[0].qpm
    seconds_per_step = 60.0 / qpm / melody_rnn.steps_per_quarter
    total_seconds = num_steps * seconds_per_step

    generator_options = generator_pb2.GeneratorOptions()
    generator_options.args['temperature'].float_value = temperature
    generate_section = generator_options.generate_sections.add(
        start_time=last_end_time + seconds_per_step,
        end_time=last_end_time + total_seconds)

    # Ask the model to continue the sequence.
    return melody_rnn.generate(primer_sequence, generator_options)

#
# def generate_midi(midi_data, total_seconds=10):
#     primer_sequence = magenta.music.midi_io.midi_to_sequence_proto(midi_data)
#
#     # predict the tempo
#     if len(primer_sequence.notes) > 4:
#         estimated_tempo = midi_data.estimate_tempo()
#         if estimated_tempo > 240:
#             qpm = estimated_tempo / 2
#         else:
#             qpm = estimated_tempo
#     else:
#         qpm = 120
#     primer_sequence.tempos[0].qpm = qpm
#
#     generator_options = generator_pb2.GeneratorOptions()
#     # Set the start time to begin on the next step after the last note ends.
#     last_end_time = (max(n.end_time for n in primer_sequence.notes)
#                      if primer_sequence.notes else 0)
#     generator_options.generate_sections.add(
#         start_time=last_end_time + _steps_to_seconds(1, qpm),
#         end_time=total_seconds)
#
#     # generate the output sequence
#     generated_sequence = generator.generate(primer_sequence, generator_options)
#
#     output = tempfile.NamedTemporaryFile()
#     magenta.music.midi_io.sequence_proto_to_midi_file(generated_sequence, output.name)
#     output.seek(0)
#     return output
